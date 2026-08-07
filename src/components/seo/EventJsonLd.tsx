import { DAYS } from "@/content/events";
import { FESTIVAL_DATES, SITE } from "@/content/site";

const BASE = "https://siargaofoodfest.com";

/**
 * Structured data for the festival and its programme. A festival is exactly what
 * schema.org/Festival describes, and the sub-events are what let search surface individual
 * dinners and workshops rather than only the top-level week.
 *
 * Offers are deliberately omitted: nothing is sold online, so claiming a price or a
 * purchase URL would be wrong. Free events say so via `isAccessibleForFree`.
 */
export function EventJsonLd() {
  const location = {
    "@type": "Place",
    name: FESTIVAL_DATES.location,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Surigao del Norte",
      addressCountry: "PH",
    },
  };

  const subEvents = DAYS.flatMap((day) =>
    day.events.map((event) => ({
      "@type": "FoodEvent",
      name: event.title,
      description: event.blurb,
      startDate: day.allWeek ? FESTIVAL_DATES.start : undefined,
      endDate: day.allWeek ? FESTIVAL_DATES.end : undefined,
      isAccessibleForFree: event.tier !== "paid",
      location: { "@type": "Place", name: event.venue, address: location.address },
    })),
  );

  const data = {
    "@context": "https://schema.org",
    "@type": "Festival",
    name: SITE.name,
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
