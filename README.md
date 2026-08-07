# Siargao Food & Wine Festival — 2026

The festival site: a weeklong celebration of food, culture and community on Siargao Island,
**26–31 August 2026**.

Built from the mobile prototype in the Claude Design project *Website redesign information
architecture* — the live indigo-dye background, the hand-cut bubble shapes, the scroll-driven
nav and the "why we do this" growing-line story are all ported from it rather than reinterpreted.

## Running it

```bash
npm install
cp .env.example .env.local   # fill in before the tickets form can send
npm run dev
```

| Command | |
|---|---|
| `npm run dev` | dev server on :3000 |
| `npm run build` | production build, typechecks as it goes |
| `npm test` | vitest — content integrity, form validation, design invariants |
| `npm run typecheck` | `tsc --noEmit` |
| `npx eslint .` | lint |

## Environment

Only the tickets enquiry form needs configuration. Without it the page still works and the
form reports that email isn't wired up yet.

| Variable | |
|---|---|
| `RESEND_API_KEY` | Resend key for sending enquiries |
| `CONTACT_EMAIL_TO` | where enquiries land |
| `CONTACT_EMAIL_FROM` | verified sender on your Resend domain |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | wa.me format, digits only. Blank hides the WhatsApp button |

No database. Content is typed TypeScript in `src/content/` — editing the programme is a commit.

## Deploying

Vercel, zero config. Set the four variables above in the project settings.

## Before launch

Open questions for the festival are listed at the end of [CLAUDE.md](CLAUDE.md) — most
importantly **confirm the 2026 dates**, which disagree across the festival's own sources.

## Docs

- [CLAUDE.md](CLAUDE.md) — design and content rules that are the brand, not preferences
- [project-docs/deviations-from-prototype.md](project-docs/deviations-from-prototype.md) —
  every deliberate difference from the prototype, and why
