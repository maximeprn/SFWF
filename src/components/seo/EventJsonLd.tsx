import { DAYS } from "@/content/events";
import { FESTIVAL_DATES, SITE, SITE_URL } from "@/content/site";
import { placeOf } from "@/content/venues";
import { access } from "@/lib/program/eventCopy";

const BASE = SITE_URL;

/**
 * Structured data for the festival and its programme. A festival is exactly what
 * schema.org/Festival describes, and the sub-events are what let search surface individual
 * dinners and workshops rather than only the top-level week.
 *
 * Offers are deliberately omitted even though the programme now carries prices: nothing is
 * sold here, so a price with no purchase URL would claim a transaction that does not exist.
 * Walk-in events say so through `isAccessibleForFree`.
 */
export function EventJsonLd() {
  const address = {
    "@type": "PostalAddress",
    addressRegion: "Surigao del Norte",
    addressCountry: "PH",
  };
  const location = { "@type": "Place", name: FESTIVAL_DATES.location, address };

  const subEvents = DAYS.flatMap((day) =>
    day.events.map((event) => ({
      "@type": "FoodEvent",
      name: event.title,
      description: event.desc ?? undefined,
      /* Day granularity only — the published times are strings like "DINNER" and
         "1ST SEATING 5PM · 2ND 8PM", which no ISO timestamp can honestly represent. */
      startDate: dayDate(day.date),
      isAccessibleForFree: !access(event).dot,
      location: { "@type": "Place", name: placeOf(event.venue), address },
    })),
  );

  const data = {
    "@context": "https://schema.org",
    "@type": "Festival",
    name: SITE.name,
    alternateName: SITE.edition,
    description: SITE.description,
    startDate: FESTIVAL_DATES.start,
    endDate: FESTIVAL_DATES.end,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: BASE,
    location,
    organizer: { "@type": "Organization", name: SITE.name, url: BASE },
    subEvent: subEvents,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** `AUG 26` → `2026-08-26`, off the year the dateline already states. */
function dayDate(date: string): string {
  const year = FESTIVAL_DATES.start.slice(0, 4);
  return `${year}-08-${date.replace("AUG ", "").padStart(2, "0")}`;
}
