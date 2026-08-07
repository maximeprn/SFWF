import { z } from "zod";

/** What the enquiry is about. Drives the subject line and the WhatsApp opener. */
export const TOPICS = [
  { value: "passport", label: "Crawl passport" },
  { value: "event", label: "A specific event" },
  { value: "group", label: "Group booking" },
  { value: "media", label: "Media accreditation" },
  { value: "other", label: "Something else" },
] as const;

export type Topic = (typeof TOPICS)[number]["value"];

const topicValues = TOPICS.map((t) => t.value) as [Topic, ...Topic[]];

/**
 * Shared by the form and the route, so the client and the server can never disagree about
 * what counts as valid. Server-side validation is the one that matters — the client copy
 * only exists to give immediate feedback.
 */
export const ticketEnquirySchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(80),
  email: z.email("That email address doesn't look right.").max(160),
  topic: z.enum(topicValues, "Please pick what your message is about."),
  message: z
    .string()
    .trim()
    .min(10, "A sentence or two helps us answer properly.")
    .max(2000, "Please keep it under 2000 characters."),
  /**
   * Honeypot. Real people never see this field, so anything in it is a bot. Named
   * plausibly rather than "honeypot" so naive scrapers fill it in.
   *
   * Deliberately permissive: rejecting a filled honeypot here would tell the bot the field
   * is checked. The route accepts the request and quietly drops it instead. The cap only
   * stops an oversized payload.
   */
  company: z.string().max(200).optional(),
});

export type TicketEnquiry = z.infer<typeof ticketEnquirySchema>;

export const topicLabel = (topic: Topic): string =>
  TOPICS.find((t) => t.value === topic)?.label ?? topic;
