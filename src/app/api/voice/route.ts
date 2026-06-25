import { getGenAI } from "@/lib/gemini";
import { VOICE_MODEL } from "@/lib/voice-config";

// The SDK needs the Node runtime (not Edge), and the token must never be cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mints a short-lived, single-use ephemeral token from GEMINI_API_KEY. The
 * browser uses `token` as its apiKey to open the Live websocket directly to
 * Google — the long-lived key stays on the server.
 */
export async function POST() {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: "voice_unconfigured", message: "GEMINI_API_KEY is not set on the server." },
      { status: 503 },
    );
  }

  try {
    const ai = getGenAI();
    const now = Date.now();

    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(now + 30 * 60_000).toISOString(), // hard expiry ≤ 30 min
        newSessionExpireTime: new Date(now + 60_000).toISOString(), // open a session within 1 min
        // Lock the model so a leaked token can't be repointed; client config
        // (system instruction, tools, voice) still applies.
        liveConnectConstraints: { model: VOICE_MODEL },
        httpOptions: { apiVersion: "v1alpha" },
      },
    });

    return Response.json({ token: token.name, model: VOICE_MODEL });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error minting token.";
    console.error("[/api/voice] token mint failed:", message);
    return Response.json({ error: "mint_failed", message }, { status: 500 });
  }
}
