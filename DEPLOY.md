# Deploying AURELIA to your VPS

A premium gradient sneaker store (Next.js 16, App Router) with a **Gemini Live**
voice concierge that answers questions and navigates the site by voice.

---

## ⭐ The ONLY step you need to do: add your key

The entire app is wired and ready. You only have to provide **one secret** — your
Google Gemini API key — and the voice agent comes alive.

1. Get a key at <https://aistudio.google.com/apikey>.
   **Use a legacy `AIza…` key** (the newer `AQ.*` format is currently rejected by
   the ephemeral-token endpoint).
2. Put it in your env file:

   **Local dev** → create `.env.local`:
   ```bash
   GEMINI_API_KEY=AIza...your-key...
   ```

   **Production (VPS)** → create `/var/www/aurelia/.env`:
   ```bash
   GEMINI_API_KEY=AIza...your-key...
   NODE_ENV=production
   PORT=3000
   HOSTNAME=127.0.0.1
   # optional:
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```
   ```bash
   chmod 600 /var/www/aurelia/.env
   ```

That's it. The key never reaches the browser — the server mints short-lived,
single-use ephemeral tokens (`/api/voice`), and the browser opens the realtime
websocket directly to Google with that token.

> Want **Grok Voice** instead of Gemini? See the note at the bottom.

---

## Run it locally

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

The site works fully without a key — only the voice orb shows a "needs setup"
state until `GEMINI_API_KEY` is present.

---

## Deploy to a fresh Ubuntu VPS

```bash
# 1) Base packages
apt update && apt -y upgrade
apt install -y git build-essential nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -   # Node 22 LTS
apt install -y nodejs
npm install -g pm2 pnpm

# 2) App dir + code
mkdir -p /var/www/aurelia && cd /var/www/aurelia
#   ...rsync/scp/clone this repo here...

# 3) Secret env (see above)
nano .env && chmod 600 .env

# 4) Install + build
pnpm install --frozen-lockfile
pnpm add sharp                       # needed for next/image under standalone
pnpm build

# 5) Standalone needs static + public copied in
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

# 6) Start under pm2 (uses ecosystem.config.js)
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd                  # run the sudo command it prints

# 7) Smoke test on the box
curl -I http://127.0.0.1:3000        # 200
curl -X POST http://127.0.0.1:3000/api/voice   # JSON token (once key is set)
```

### nginx + HTTPS

```bash
cp deploy/nginx.conf /etc/nginx/sites-available/aurelia    # edit the domain first
# move the `map` block into /etc/nginx/conf.d/ws-upgrade.conf (see the file's header)
ln -s /etc/nginx/sites-available/aurelia /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw --force enable

apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com --redirect -m you@email.com --agree-tos --no-eff-email
```

HTTPS is **required** — browsers only grant microphone access on a secure origin.

### Redeploys (zero-downtime)

```bash
git pull && pnpm install --frozen-lockfile && pnpm build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
pm2 reload aurelia
```

---

## How the voice agent works

- **Model:** `gemini-2.5-flash-native-audio-preview-12-2025` (native speech-to-speech).
- **Mic:** 16 kHz mono PCM, captured via an `AudioWorklet`, streamed up.
- **Speaker:** 24 kHz PCM, scheduled for gapless playback, with barge-in (the agent
  stops talking the moment you do).
- **Tools the agent can call:** `navigate_to_page`, `view_product`, `add_to_cart`,
  `open_cart`, `search_catalog` — that's how it walks you around the site and fills
  your bag by voice.
- Change the voice in the panel dropdown; toggle captions if you want text.

---

## Swapping to Grok Voice (xAI) later

The voice layer is isolated in two files:
- `src/app/api/voice/route.ts` — mints the realtime token (swap to xAI's token flow)
- `src/components/voice/VoiceAgent.tsx` — opens the realtime session (swap the SDK
  + audio wiring; the tool/navigation logic stays identical)

Everything else (catalog, design, cart) is provider-agnostic.
