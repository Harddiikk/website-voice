"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Captions, CaptionsOff, Loader2, Mic, Sparkles, X } from "lucide-react";
import type { FunctionDeclaration } from "@google/genai";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useVoiceControl } from "@/components/voice/VoiceControlProvider";
import { getProduct, searchProducts } from "@/lib/products";
import {
  buildSystemInstruction,
  DEFAULT_VOICE,
  VOICE_MODEL,
  VOICE_OPTIONS,
} from "@/lib/voice-config";
import { cn } from "@/lib/utils";

type Status = "idle" | "connecting" | "listening" | "speaking" | "error" | "unconfigured";

// AudioWorklet: converts Float32 mic frames → little-endian Int16 PCM and ships
// them to the main thread. Runs off the main thread to avoid audio glitches.
const PCM_WORKLET = `
class PCMProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch) {
      const pcm = new Int16Array(ch.length);
      for (let i = 0; i < ch.length; i++) {
        const s = Math.max(-1, Math.min(1, ch[i]));
        pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      this.port.postMessage(pcm.buffer, [pcm.buffer]);
    }
    return true;
  }
}
registerProcessor('pcm-processor', PCMProcessor);
`;

function b64encode(buf: ArrayBuffer) {
  let bin = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}
function b64decode(b64: string) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

export function VoiceAgent() {
  const router = useRouter();
  const { addItem, setOpen } = useCart();
  const voiceControl = useVoiceControl();

  const [status, setStatus] = useState<Status>("idle");
  const [expanded, setExpanded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [voice, setVoice] = useState<string>(DEFAULT_VOICE);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [caption, setCaption] = useState("");

  // Mutable engine state (avoids stale closures / re-renders).
  const sessionRef = useRef<any>(null);
  const micCtxRef = useRef<AudioContext | null>(null);
  const playCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserMicRef = useRef<AnalyserNode | null>(null);
  const analyserOutRef = useRef<AnalyserNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartRef = useRef(0);
  const lastAudioRef = useRef(0);
  const handleRef = useRef<string | undefined>(undefined);
  const connectRef = useRef<((h?: string) => Promise<unknown>) | null>(null);
  const rafRef = useRef<number>(0);
  const stoppingRef = useRef(false);
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const actionsRef = useRef({ router, addItem, setOpen, voiceControl });
  actionsRef.current = { router, addItem, setOpen, voiceControl };

  const flushPlayback = useCallback(() => {
    sourcesRef.current.forEach((s) => {
      try {
        s.stop();
      } catch {
        /* already stopped */
      }
    });
    sourcesRef.current.clear();
    nextStartRef.current = 0;
  }, []);

  const playPCM = useCallback((b64: string) => {
    const ctx = playCtxRef.current;
    const analyser = analyserOutRef.current;
    if (!ctx || !analyser) return;
    const i16 = new Int16Array(b64decode(b64));
    const f32 = new Float32Array(i16.length);
    for (let i = 0; i < i16.length; i++) f32[i] = i16[i] / 32768;
    const buf = ctx.createBuffer(1, f32.length, 24000);
    buf.getChannelData(0).set(f32);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(analyser);
    nextStartRef.current = Math.max(nextStartRef.current, ctx.currentTime);
    src.start(nextStartRef.current);
    nextStartRef.current += buf.duration;
    lastAudioRef.current = performance.now();
    sourcesRef.current.add(src);
    src.onended = () => sourcesRef.current.delete(src);
    if (!stoppingRef.current) setStatus("speaking");
  }, []);

  // Visualizer + speaking→listening transition loop.
  const runVisualizer = useCallback(() => {
    const tick = () => {
      const speaking = sourcesRef.current.size > 0 || performance.now() - lastAudioRef.current < 180;
      const analyser = speaking ? analyserOutRef.current : analyserMicRef.current;
      let amp = 0;
      if (analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        amp = Math.min(1, sum / data.length / 90);
      }
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const wobble = 0.5 + 0.5 * Math.sin(performance.now() / 180 + i * 1.3);
        const h = 0.18 + amp * wobble * 1.1;
        bar.style.transform = `scaleY(${Math.max(0.12, Math.min(1, h))})`;
      });
      // settle status when model stops talking
      if (!speaking && sessionRef.current && !stoppingRef.current) {
        setStatus((s) => (s === "speaking" ? "listening" : s));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleMessage = useCallback(
    (message: any) => {
      const sc = message.serverContent;
      if (sc?.interrupted) {
        flushPlayback();
        setStatus("listening");
      }
      if (sc?.modelTurn?.parts) {
        for (const p of sc.modelTurn.parts) {
          if (p.inlineData?.data) playPCM(p.inlineData.data);
        }
      }
      // optional captions
      if (sc?.outputTranscription?.text) {
        setCaption((c) => (c + sc.outputTranscription.text).slice(-220));
      }
      if (sc?.turnComplete) setCaption("");

      if (message.toolCall) {
        const { router, addItem, setOpen, voiceControl } = actionsRef.current;
        const functionResponses = [];
        for (const fc of message.toolCall.functionCalls ?? []) {
          let result = "ok";
          try {
            switch (fc.name) {
              case "navigate_to_page":
                router.push(fc.args?.path || "/");
                result = `navigated to ${fc.args?.path}`;
                break;
              case "view_product": {
                const p = getProduct(fc.args?.productId);
                if (p) {
                  router.push(`/products/${p.id}`);
                  result = `showing ${p.name}`;
                } else result = "product not found";
                break;
              }
              case "add_to_cart": {
                const p = getProduct(fc.args?.productId);
                if (p) {
                  addItem(p, fc.args?.size);
                  result = `added ${p.name} to the bag`;
                } else result = "product not found";
                break;
              }
              case "open_cart":
                setOpen(true);
                result = "opened the bag";
                break;
              case "search_catalog": {
                const matches = searchProducts(fc.args?.query || "").slice(0, 5);
                result = matches.length
                  ? matches.map((p) => `${p.name} ($${p.price}, ${p.category}, id ${p.id})`).join("; ")
                  : "no matches found";
                break;
              }
              case "select_size":
                result = voiceControl.selectSize(Number(fc.args?.size)).message;
                break;
              case "select_color":
                result = voiceControl.selectColor(fc.args?.colorway ?? fc.args?.color).message;
                break;
              case "set_quantity":
                result = voiceControl.setQty(Number(fc.args?.quantity)).message;
                break;
              case "add_selected_to_cart":
                result = voiceControl.addActiveToCart().message;
                break;
              case "place_order":
                result = fc.args?.confirm
                  ? voiceControl.placeOrder().message
                  : "Ask the shopper to confirm out loud before placing the order.";
                break;
              default:
                result = "unknown tool";
            }
          } catch {
            result = "action failed";
          }
          functionResponses.push({ id: fc.id, name: fc.name, response: { result } });
        }
        sessionRef.current?.sendToolResponse({ functionResponses });
      }

      if (message.sessionResumptionUpdate?.resumable && message.sessionResumptionUpdate?.newHandle) {
        handleRef.current = message.sessionResumptionUpdate.newHandle;
      }
      if (message.goAway) {
        // server will drop soon — reconnect transparently using the resume handle
        connectRef.current?.(handleRef.current)?.catch((err) => {
          console.error("[voice] goAway reconnect failed", err);
          if (!stoppingRef.current) {
            setStatus("error");
            setErrorMsg("Connection was lost. Tap the orb to reconnect.");
          }
        });
      }
    },
    [flushPlayback, playPCM],
  );

  // Opens (or re-opens) a Live session. Reuses the existing audio graph.
  const connect = useCallback(
    async (resumeHandle?: string) => {
      const res = await fetch("/api/voice", { method: "POST" });
      if (res.status === 503) {
        setStatus("unconfigured");
        throw new Error("unconfigured");
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Failed to start voice session");
      }
      const { token, model } = await res.json();

      const { GoogleGenAI, Modality, Type } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: token, httpOptions: { apiVersion: "v1alpha" } });

      const declarations: FunctionDeclaration[] = [
        {
          name: "navigate_to_page",
          description: "Navigate to a top-level page of the site.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              path: { type: Type.STRING, description: "One of: / , /products , /about , /contact" },
            },
            required: ["path"],
          },
        },
        {
          name: "view_product",
          description: "Open a specific product's detail page by its catalog id.",
          parameters: {
            type: Type.OBJECT,
            properties: { productId: { type: Type.STRING } },
            required: ["productId"],
          },
        },
        {
          name: "add_to_cart",
          description: "Add a product to the shopping bag by id, with an optional US size.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              productId: { type: Type.STRING },
              size: { type: Type.NUMBER, description: "US size, optional" },
            },
            required: ["productId"],
          },
        },
        {
          name: "open_cart",
          description: "Open / reveal the shopping bag drawer.",
          parameters: { type: Type.OBJECT, properties: {} },
        },
        {
          name: "search_catalog",
          description: "Search the catalog by a single keyword or need; returns matching products.",
          parameters: {
            type: Type.OBJECT,
            properties: { query: { type: Type.STRING } },
            required: ["query"],
          },
        },
        {
          name: "select_size",
          description:
            "Select a US size on the product detail page currently open (highlights it like a tap). Only valid after view_product has opened a product.",
          parameters: {
            type: Type.OBJECT,
            properties: { size: { type: Type.NUMBER, description: "US size; must be one the product offers" } },
            required: ["size"],
          },
        },
        {
          name: "select_color",
          description: "Select a colorway on the open product: 'primary', 'shadow', or 'accent'.",
          parameters: {
            type: Type.OBJECT,
            properties: { colorway: { type: Type.STRING, description: "primary | shadow | accent" } },
            required: ["colorway"],
          },
        },
        {
          name: "set_quantity",
          description: "Set how many pairs of the open product the shopper wants (minimum 1).",
          parameters: {
            type: Type.OBJECT,
            properties: { quantity: { type: Type.INTEGER } },
            required: ["quantity"],
          },
        },
        {
          name: "add_selected_to_cart",
          description:
            "Add the OPEN product to the bag using the size, colorway and quantity selected on screen. Prefer this once a size is selected.",
          parameters: { type: Type.OBJECT, properties: {} },
        },
        {
          name: "place_order",
          description:
            "Place / check out the order for everything in the bag. Final committing step — only call with confirm=true after the shopper clearly agrees out loud.",
          parameters: {
            type: Type.OBJECT,
            properties: { confirm: { type: Type.BOOLEAN, description: "true only after an explicit spoken yes" } },
            required: ["confirm"],
          },
        },
      ];

      const session = await ai.live.connect({
        model: model || VOICE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: buildSystemInstruction(),
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
            languageCode: "en-US",
          },
          tools: [{ functionDeclarations: declarations }],
          outputAudioTranscription: {},
          contextWindowCompression: { slidingWindow: {} },
          sessionResumption: resumeHandle ? { handle: resumeHandle } : {},
        },
        callbacks: {
          onopen: () => setStatus("listening"),
          onmessage: handleMessage,
          onerror: (e: any) => {
            console.error("[voice] live error", e);
          },
          onclose: () => {
            // unexpected drop while active → one transparent reconnect attempt
            if (!stoppingRef.current && sessionRef.current) {
              sessionRef.current = null;
            }
          },
        },
      });
      sessionRef.current = session;

      // greet on first open
      if (!resumeHandle) {
        session.sendClientContent({
          turns: [
            {
              role: "user",
              parts: [
                {
                  text:
                    "(The shopper just opened the voice concierge. Greet them warmly in one short sentence and ask how you can help.)",
                },
              ],
            },
          ],
          turnComplete: true,
        });
      }
      return session;
    },
    [voice, handleMessage],
  );
  connectRef.current = connect;

  const setupAudio = useCallback(async () => {
    // getUserMedia only exists in a secure context (https or http://localhost).
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      throw new Error("insecure_context");
    }
    // playback graph @ 24kHz
    const playCtx = new AudioContext({ sampleRate: 24000 });
    await playCtx.resume().catch(() => {});
    const analyserOut = playCtx.createAnalyser();
    analyserOut.fftSize = 256;
    analyserOut.connect(playCtx.destination);
    playCtxRef.current = playCtx;
    analyserOutRef.current = analyserOut;

    // mic capture @ 16kHz
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
    streamRef.current = stream;
    const micCtx = new AudioContext({ sampleRate: 16000 });
    micCtxRef.current = micCtx;
    const blobUrl = URL.createObjectURL(new Blob([PCM_WORKLET], { type: "application/javascript" }));
    await micCtx.audioWorklet.addModule(blobUrl);
    URL.revokeObjectURL(blobUrl);
    const srcNode = micCtx.createMediaStreamSource(stream);
    const worklet = new AudioWorkletNode(micCtx, "pcm-processor");
    worklet.port.onmessage = (ev: MessageEvent) => {
      const s = sessionRef.current;
      if (s) s.sendRealtimeInput({ audio: { data: b64encode(ev.data), mimeType: "audio/pcm;rate=16000" } });
    };
    const analyserMic = micCtx.createAnalyser();
    analyserMic.fftSize = 256;
    srcNode.connect(analyserMic);
    srcNode.connect(worklet);
    analyserMicRef.current = analyserMic;
  }, []);

  const stop = useCallback(() => {
    stoppingRef.current = true;
    cancelAnimationFrame(rafRef.current);
    try {
      sessionRef.current?.close();
    } catch {
      /* noop */
    }
    sessionRef.current = null;
    flushPlayback();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    micCtxRef.current?.close().catch(() => {});
    playCtxRef.current?.close().catch(() => {});
    micCtxRef.current = null;
    playCtxRef.current = null;
    streamRef.current = null;
    handleRef.current = undefined;
    setCaption("");
    setStatus("idle");
  }, [flushPlayback]);

  const start = useCallback(async () => {
    setErrorMsg("");
    setExpanded(true);
    setStatus("connecting");
    stoppingRef.current = false;
    try {
      await setupAudio();
      // Use the ref so a re-mounted/updated connect (e.g. after a voice change)
      // is always the one invoked — avoids a stale-closure reconnect.
      await connectRef.current?.();
      runVisualizer();
    } catch (e: any) {
      if (e?.message === "unconfigured") {
        setStatus("unconfigured");
      } else if (e?.message === "insecure_context") {
        setStatus("error");
        setErrorMsg("Open the site on http://localhost:3000 or HTTPS — the mic is blocked on plain-IP/insecure pages.");
      } else if (e?.name === "NotAllowedError" || e?.name === "SecurityError") {
        setStatus("error");
        setErrorMsg("Mic blocked. Allow it via the icon in your browser's address bar — and on macOS in System Settings ▸ Privacy & Security ▸ Microphone — then tap to retry.");
      } else if (e?.name === "NotFoundError" || e?.name === "OverconstrainedError") {
        setStatus("error");
        setErrorMsg("No microphone was found. Plug one in or check your input device.");
      } else {
        setStatus("error");
        setErrorMsg(e?.message || "Couldn't start the voice session.");
      }
      // tear down any partial setup
      streamRef.current?.getTracks().forEach((t) => t.stop());
      micCtxRef.current?.close().catch(() => {});
      playCtxRef.current?.close().catch(() => {});
    }
  }, [setupAudio, runVisualizer]);

  // Change voice → restart session if live so the new voice applies.
  const changeVoice = useCallback(
    (v: string) => {
      setVoice(v);
      if (sessionRef.current) {
        stop();
        setTimeout(() => start(), 250);
      }
    },
    [start, stop],
  );

  useEffect(() => () => stop(), [stop]);

  const active = status !== "idle";
  const statusLabel: Record<Status, string> = {
    idle: "Talk to AURELIA",
    connecting: "Connecting…",
    listening: "Listening…",
    speaking: "Speaking…",
    error: errorMsg || "Something went wrong",
    unconfigured: "Voice needs setup",
  };

  return (
    <div className="fixed bottom-5 right-5 z-[55] flex flex-col items-end gap-3">
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="glass w-[320px] overflow-hidden p-0"
          >
            <header className="flex items-center justify-between border-b border-black/[0.08] px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-[var(--primary-soft)]" />
                <span className="font-display text-sm">AURELIA Concierge</span>
              </div>
              <button
                onClick={stop}
                className="rounded-full p-1.5 text-[var(--text-muted)] transition hover:bg-black/[0.06] hover:text-[var(--text)]"
                aria-label="End conversation"
              >
                <X size={16} />
              </button>
            </header>

            <div className="flex flex-col items-center gap-4 px-4 py-6">
              {/* orb + visualizer */}
              <div className="relative grid h-28 w-28 place-items-center">
                {(status === "listening" || status === "speaking") && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "var(--grad-primary)",
                      animation: "orbpulse 1.8s ease-out infinite",
                      opacity: 0.5,
                    }}
                  />
                )}
                <div
                  className="relative grid h-24 w-24 place-items-center rounded-full"
                  style={{ background: "var(--grad-primary)", boxShadow: "var(--glow-primary)" }}
                >
                  {status === "connecting" ? (
                    <Loader2 className="animate-spin text-white" size={28} />
                  ) : (
                    <div className="flex h-10 items-end gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <span
                          key={i}
                          ref={(el) => {
                            barsRef.current[i] = el;
                          }}
                          className="w-1.5 origin-bottom rounded-full bg-white"
                          style={{ height: "100%", transform: "scaleY(0.2)" }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <p
                className={cn(
                  "text-center text-sm",
                  status === "error" || status === "unconfigured"
                    ? "text-[var(--magenta)]"
                    : "text-[var(--text-muted)]",
                )}
              >
                {statusLabel[status]}
              </p>

              {status === "unconfigured" && (
                <p className="rounded-xl bg-black/[0.04] px-3 py-2 text-center text-xs text-[var(--text-subtle)]">
                  Add <code className="text-[var(--primary-soft)]">GEMINI_API_KEY</code> to the server&apos;s
                  environment, then restart.
                </p>
              )}

              {captionsOn && caption && (
                <p className="max-h-16 overflow-hidden text-center text-xs leading-relaxed text-[var(--text-subtle)]">
                  {caption}
                </p>
              )}

              {/* controls */}
              <div className="flex w-full items-center justify-between gap-2 border-t border-black/[0.08] pt-4">
                <select
                  value={voice}
                  onChange={(e) => changeVoice(e.target.value)}
                  className="rounded-full border border-black/[0.08] bg-black/[0.04] px-3 py-1.5 text-xs text-[var(--text-muted)] outline-none"
                  aria-label="Voice"
                >
                  {VOICE_OPTIONS.map((v) => (
                    <option key={v.id} value={v.id} className="bg-[var(--surface-2)]">
                      {v.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setCaptionsOn((v) => !v)}
                  className="flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-black/[0.04] px-3 py-1.5 text-xs text-[var(--text-muted)] transition hover:text-[var(--text)]"
                  aria-label="Toggle captions"
                >
                  {captionsOn ? <Captions size={14} /> : <CaptionsOff size={14} />}
                  {captionsOn ? "Captions" : "Captions"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* floating orb button */}
      <motion.button
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => (active ? stop() : start())}
        className="relative grid h-16 w-16 place-items-center rounded-full"
        style={{ background: "var(--grad-primary)", boxShadow: "var(--glow-primary)" }}
        aria-label={active ? "End voice conversation" : "Talk to the AURELIA concierge"}
      >
        {!active && (
          <span
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--grad-primary)", animation: "orbpulse 2.4s ease-out infinite", opacity: 0.45 }}
          />
        )}
        {active ? <X className="relative text-white" size={24} /> : <Mic className="relative text-white" size={24} />}
      </motion.button>
    </div>
  );
}
