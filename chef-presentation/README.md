# Chef presentation — venue photo library

Source material for the chef presentation built in Claude Design. **Nothing here feeds the
festival site** — `src/content/` remains the only content the site reads.

One file per venue in `venues/`, each split the same three ways:

- **Chef shots** — the people. Faces, kitchen, service, portraits.
- **Food shots** — plates and dishes.
- **Venue shots** — room, terrace, table, view.

Each entry carries a written description, a direct image URL and the real pixel size, so a shot
can be chosen without opening sixteen tabs. Where a category is empty it says so — an empty
heading is a finding, not an omission.

## Conventions

- Record the **largest** version available. On Squarespace that is `?format=2500w`.
- Note the pixel size. Under ~1500px wide is a laptop slide, not a projected or printed one.
- Say what is actually in the frame. "Terrace at dusk with the boats behind" beats "venue 3".
- Credit belongs to the venue. Ask before anything is published or printed.

## Status

| Venue | Instagram | Source found | Chef | Food | Venue |
|---|---|---|---|---|---|
| Alma | @almasiargao | [website](https://www.almaphilippines.com/) — all 4 pages → [alma.md](venues/alma.md) | 4 | 9 | 3 |
| Wild | @wild.siargao | [wildsiargao.ph](https://wildsiargao.ph) — 12 pages → [wild.md](venues/wild.md) | 8 | 9 | 7 |
| Siargao Corner Café | *none on record* | — | — | — | — |
| Roots (GL public market) | @roots.siargao | — | — | — | — |
| Lunares Café | @lunarescafe | — | — | — | — |
| Isla Panciteria | @islapanciteria.siargao | — | — | — | — |
| Lokal Hub | @lokallab | — | — | — | — |
| Lyma | @lymasiargao | [lymasiargao.com](https://www.lymasiargao.com) — 6 pages → [lyma.md](venues/lyma.md) | 6 | 6 | 2 |
| Tropical Academy, San Isidro | @tropicalacademyiao *(unverified)* | — | — | — | — |
| Kermit | @kermitsiargao | — | — | — | — |
| Lamari | @lamarisiargao | — | — | — | — |
| Paraluman | @paraluman.ph | — | — | — | — |
| Mam-on Island (Cev) | @cevsiargao | — | — | — | — |
| Bravo | @bravosiargao | — | — | — | — |
| Sagana | @saganasiargao | — | — | — | — |
| Hue Hotel | @huesiargao | — | — | — | — |

Handles come from `src/content/venues.ts`, which is the festival's booking table and the only
list of these sixteen that is kept current.

## Method

1. **Find the site.** Most of these venues have one. Don't assume Instagram-only.
2. **Read `/sitemap.xml` first**, then every page on it. The chef is rarely on the venue page —
   Alma's portrait and Wild's whole tuna series both sat on `/our-story`.
3. **Gather, then triage.** Fetch every page and collect image URLs, then lay them out as one
   contact sheet and pick from that. Wild was 147 images; 24 were worth keeping.
   If fetching the HTML returns no images, the site is client-side rendered (Lyma) — load each
   page in a same-origin iframe and read `document.images` instead.
4. **Select, don't hoard.** Menus, logo marks, mural documentation and the fourth near-identical
   buffet spread are not presentation material.
5. **Check the real pixel size** before committing to a shot, and **look at each one** before
   describing it — filenames lie.
6. **Never caption a face with a name the site doesn't state.** Guest chefs are common.

## What Alma proved

The Siargao page alone had five photos and **no chef**. The **Our Story** page — which is not
linked from the venue page's main flow — had ten more, including the chef portrait, three
hands-at-work shots and a full biography. Nine of those ten are 2500×3750.

**Always read every page in the sitemap.** `/sitemap.xml` lists them; the venue page is rarely
where the chef lives.

Still open: **Morris Danzen** — half the Alma billing — appears nowhere on Alma's site, so even a
well-documented venue can be only half covered.

## What Wild proved

Photography quality varies enormously between venues. Wild has a real editorial shoot — a
whole-tuna butchery series at 1365×2048 and up, one frame at 4160×6240 — where Alma's only chef
portrait is a 1023×1280 phone photo. Budget the presentation around who actually has usable
images, and ask the thin venues early.

It also showed the opposite failure to Alma's: **too much**, not too little. 147 images, of which
16 mattered.
