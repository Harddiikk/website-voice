# Deploying AURELIA on Coolify

Coolify runs this app as a **Docker container** behind its built-in proxy (Traefik),
with automatic Let's Encrypt SSL and runtime env-var injection. A production
`Dockerfile` (Next.js standalone, non-root) is already included — Coolify will detect
and use it.

---

## TL;DR

1. Push this repo to a Git provider (GitHub / GitLab / Gitea).
2. In Coolify: **New Resource → Application → your repo**, Build Pack = **Dockerfile**.
3. Set **Port = 3000**, add a **domain**, add env var **`GEMINI_API_KEY`**.
4. Deploy. Open the HTTPS URL, tap the orb, talk.

---

## Step by step

### 1. Get the code into Git
Coolify deploys from a Git repository.
```bash
git add -A
git commit -m "AURELIA voice store"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Create the application in Coolify
- **New Resource → Application**, pick your Git source and this repository/branch.
- **Build Pack: `Dockerfile`** (Coolify auto-detects the `Dockerfile` at the repo root).
  Do *not* choose "Static" — this app has a server (`/api/voice`, SSR).

### 3. Networking
- **Ports Exposes: `3000`** — the container listens on `0.0.0.0:3000` (set in the
  Dockerfile via `HOSTNAME=0.0.0.0`, which is required so Coolify's proxy can reach it).
- **Domain:** set your FQDN (e.g. `shoes.yourdomain.com`). Point its DNS A record at the
  Coolify server first. Coolify provisions **HTTPS automatically** — this is required:
  browsers only grant **microphone** access on a secure origin.

### 4. Environment variables (the important part)

| Variable | Value | Scope | Required |
|---|---|---|---|
| `GEMINI_API_KEY` | your `AIza…` key | **Runtime** | ✅ yes |
| `NEXT_PUBLIC_SITE_URL` | `https://shoes.yourdomain.com` | **Build-time** | optional |
| `NEXT_PUBLIC_GEMINI_MODEL` | `gemini-2.5-flash-native-audio-preview-12-2025` | **Build-time** | optional (has default) |

> ⚠️ **`NEXT_PUBLIC_*` variables are inlined at *build* time**, not runtime. In Coolify,
> mark them **"Available at Buildtime"** (they're wired as Docker build args in the
> Dockerfile). If you skip them, safe defaults are used — only `NEXT_PUBLIC_SITE_URL`
> matters (it sets absolute URLs in social/OG metadata).
>
> ✅ **`GEMINI_API_KEY` is runtime-only.** It's read server-side by `/api/voice` to mint
> short-lived ephemeral tokens; it is **never** sent to the browser and is **not** baked
> into the image. Just add it as a normal (runtime) env var. Mark it **secret**.

Use a **legacy `AIza…` key** from <https://aistudio.google.com/apikey> — the newer
`AQ.*` format is rejected by the ephemeral-token endpoint.

### 5. Health check (optional but recommended)
- Health check path: **`/api/health`** (returns `{"status":"ok"}`; also reports whether the
  key is present via `"voice": true/false`).

### 6. Deploy
Click **Deploy**. First build takes a few minutes (Next build + three.js). Every push to
the connected branch redeploys automatically.

---

## Things to keep in mind

- **Build memory:** `next build` + three.js wants ~1.5–2 GB RAM. On a 1 GB VPS the build
  can OOM — add swap, or bump the server. The *running* container is light (~150–250 MB,
  capped fine at 512 MB).
- **No database / no volumes needed.** The cart lives in the browser (`localStorage`);
  there's nothing to persist server-side. Skip Coolify "Storages".
- **The voice websocket does not go through Coolify.** The browser POSTs `/api/voice`
  (proxied normally), then opens the realtime WSS **directly to Google**. So there's no
  special websocket/Traefik config to worry about — just normal HTTP(S).
- **Don't set `HOSTNAME=127.0.0.1`** anywhere — inside a container it must be `0.0.0.0`
  (already handled). `127.0.0.1` would make the app unreachable by the proxy.
- **Single instance** is correct for this app (no shared cache needed). If you ever scale
  to multiple replicas, that's fine too — the app is stateless server-side.
- **Verify after deploy:** open the site over HTTPS, open devtools → Network → WS, tap the
  orb, and confirm the websocket connects to `generativelanguage.googleapis.com` (direct to
  Google), and that `GET /api/health` returns `"voice": true`.

---

## Local Docker test (optional)

```bash
docker build -t aurelia .
docker run --rm -p 3000:3000 -e GEMINI_API_KEY=AIza... aurelia
# → http://localhost:3000   (note: mic needs HTTPS; localhost is treated as secure)
```

For the bare-metal pm2 + nginx alternative (no Coolify), see **DEPLOY.md**.
