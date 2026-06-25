# AURELIA — Voice-Agent Sneaker Store

A premium, gradient-rich luxury sneaker storefront with an **AI voice concierge**
that answers questions out loud and navigates the site for you — built on Next.js 16
and Google's **Gemini Live** native-audio API.

![stack](https://img.shields.io/badge/Next.js-16-black) ![stack](https://img.shields.io/badge/Gemini-Live-7C5CFF) ![stack](https://img.shields.io/badge/three.js-3D-22D3EE)

## Features

- 🎙️ **Voice concierge** — realtime speech-to-speech (Gemini Live). Ask anything,
  and it navigates pages, opens products, and adds to your bag by voice. Barge-in
  supported, animated orb, optional captions, swappable voices.
- 🛍️ **Full storefront** — home, catalog (filter + sort), product detail, The Craft,
  contact. 12 placeholder products, cart with persistence.
- 🧊 **3D shoe viewer** — interactive, procedurally generated (react-three-fiber),
  recolors live with the selected colorway, fully self-hosted (no external assets).
- 🎨 **Premium design system** — obsidian + aurora gradients, glassmorphism, Syne /
  Inter / Space Grotesk, framer-motion throughout.
- 🖼️ **Self-contained product imagery** — gradient + grain + SVG sneaker placeholders,
  no external image service required.

## Quick start

```bash
pnpm install
pnpm dev
```

Add your `GEMINI_API_KEY` to `.env.local` to enable the voice agent — see **[DEPLOY.md](./DEPLOY.md)**.

## Stack

Next.js 16 · React 19 · Tailwind v4 · framer-motion · three.js / @react-three/fiber ·
`@google/genai` (Gemini Live) · TypeScript.

## Project layout

```
src/
  app/                 # routes: /, /products, /products/[slug], /about, /contact, /api/voice
  components/
    home/  product/  cart/  layout/  voice/  three/  ui/  contact/
  lib/                 # products data, site map, voice config, gemini factory
  types/
deploy/nginx.conf      # reverse proxy + TLS
ecosystem.config.js    # pm2
```

See **[DEPLOY.md](./DEPLOY.md)** for the one-step key setup and full VPS deploy guide.
