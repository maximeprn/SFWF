import { Resend } from "resend";
import { FESTIVAL_DATES } from "@/content/site";
import { topicLabel, type TicketEnquiry } from "./schema";

/** Escapes untrusted values before they go into the HTML body of the notification email. */
const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );

export interface MailConfig {
  readonly apiKey: string;
  readonly to: string;
  readonly from: string;
}

/**
 * Reads mail config from the environment. Returns null rather than throwing when unset, so
 * a deployment without mail credentials still serves the page and the WhatsApp route —
 * the form just reports that email isn't wired up yet instead of 500-ing.
 */
export function mailConfig(): MailConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM;
  if (!apiKey || !to || !from) return null;
  return { apiKey, to, from };
}

export async function sendEnquiry(
  enquiry: TicketEnquiry,
  config: MailConfig,
): Promise<void> {
  const resend = new Resend(config.apiKey);
  const topic = topicLabel(enquiry.topic);

  const { error } = await resend.emails.send({
    from: config.from,
    to: config.to,
    replyTo: enquiry.email,
    subject: `[SFWF ${FESTIVAL_DATES.label}] ${topic} — ${enquiry.name}`,
    html: `
      <p><strong>${esc(enquiry.name)}</strong> &lt;${esc(enquiry.email)}&gt;</p>
      <p><strong>About:</strong> ${esc(topic)}</p>
      <hr>
      <p style="white-space:pre-wrap">${esc(enquiry.message)}</p>
    `.trim(),
  });

  // Never swallowed: the route turns this into a 502 the visitor can act on.
  if (error) throw new Error(`Resend rejected the message: ${error.message}`);
}
