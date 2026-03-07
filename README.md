# Wilson The Vet Dev — Portfolio

A personal portfolio and planning poker tool built with Next.js, Sanity.io, and PartyKit.

## Tech Stack

- **Next.js 16** (App Router) — Framework
- **TypeScript** — Language
- **Tailwind CSS v4** — Styling
- **Sanity.io** — Headless CMS for portfolio content
- **PartyKit** — Real-time planning poker via WebSockets
- **Resend** — Contact form email delivery
- **Lucide React** — Icons

## Getting Started

```bash
npm install
npm run dev
```

The site works immediately with local fallback data — no Sanity account needed for development.

## Routes

| Route | Description |
|---|---|
| `/` | Home — hero section |
| `/projects` | Portfolio project grid |
| `/projects/[slug]` | Individual project detail |
| `/about` | Bio, skills, certifications |
| `/contact` | Contact form |
| `/poker` | Planning poker lobby |
| `/poker/[roomId]` | Planning poker room |
| `/studio` | Sanity Studio (CMS) |

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in values:

```bash
cp .env.local.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | For CMS | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | For CMS | Sanity dataset (default: `production`) |
| `RESEND_API_KEY` | For email | Resend API key |
| `NEXT_PUBLIC_PARTYKIT_HOST` | For poker | PartyKit server host |

## Deployment

**Next.js** deploys to Vercel:
```bash
npm run build
```

**PartyKit** deploys to Cloudflare:
```bash
npm run party:deploy
```

## Development — Planning Poker

Run the PartyKit dev server alongside Next.js:

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run party:dev
```
