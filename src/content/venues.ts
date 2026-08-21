import type { Venue, VenueKey } from "./types";

/**
 * Where a reservation actually goes. The festival sells nothing — every booking is a DM to
 * the venue hosting that event, so this table is the whole booking system.
 *
 * One venue has no handle on record and falls back to the festival's own account: Siargao
 * Corner Café, which is walk-in, so there is no reservation to misdirect. Sagana and Lunares
 * were the two that mattered — both priced, both sending real bookings — and both are now on
 * their own accounts.
 *
 * The fallback is why a missing handle is worth chasing rather than leaving: it does not read
 * as missing. The button still carries the venue's name and still opens an Instagram profile,
 * so nothing looks broken — only the destination is wrong. `tests/program.test.ts` pins this
 * list to exactly the venues above so a third cannot be added quietly.
 */
export const FALLBACK_HANDLE = "siargaofoodandwinefestival";

export const VENUES: Readonly<Record<VenueKey, Venue>> = {
  WILD: { place: "Wild", handle: "wild.siargao" },
  "SIARGAO CORNER CAFÉ": { place: "Siargao Corner Café", handle: null },
  "GL PUBLIC MARKET": {
    place: "General Luna public market",
    handle: "roots.siargao",
    bookName: "Roots",
  },
  ALMA: { place: "Alma", handle: "almasiargao" },
  "LUNARES CAFÉ": { place: "Lunares Café", handle: "lunarescafe" },
  "ISLA PANCITERIA": { place: "Isla Panciteria", handle: "islapanciteria.siargao" },
  "LOKAL HUB": { place: "Lokal Hub", handle: "lokallab" },
  LYMA: { place: "Lyma", handle: "lymasiargao" },
  "TROPICAL ACADEMY SAN ISIDRO": {
    place: "Tropical Academy, San Isidro",
    /* Shorter than every other handle on the list and possibly truncated at source — the
       festival has been asked to confirm it before this sends anyone to a dead profile. */
    handle: "tropicalacademyiao",
    bookName: "Tropical Academy",
  },
  KERMIT: { place: "Kermit", handle: "kermitsiargao" },
  LAMARI: { place: "Lamari", handle: "lamarisiargao" },
  PARALUMAN: { place: "Paraluman", handle: "paraluman.ph" },
  "MAM-ON ISLAND": { place: "Mam-on Island", handle: "cevsiargao", bookName: "Cev" },
  BRAVO: { place: "Bravo", handle: "bravosiargao" },
  SAGANA: { place: "Sagana", handle: "saganasiargao" },
  "HUE HOTEL": { place: "Hue Hotel", handle: "huesiargao" },
};

export const placeOf = (key: VenueKey): string => VENUES[key].place;

/** Who the booking button names — the place itself unless the venue books under another. */
export const bookNameOf = (key: VenueKey): string =>
  VENUES[key].bookName ?? VENUES[key].place;

export const instagramUrl = (key: VenueKey): string =>
  `https://www.instagram.com/${VENUES[key].handle ?? FALLBACK_HANDLE}/`;
