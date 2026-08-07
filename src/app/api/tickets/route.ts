import { NextResponse } from "next/server";
import { mailConfig, sendEnquiry } from "@/lib/tickets/mail";
import { rateLimit } from "@/lib/tickets/rate-limit";
import { ticketEnquirySchema } from "@/lib/tickets/schema";

/** Node runtime: the Resend SDK is not edge-safe. */
export const runtime = "nodejs";

const clientKey = (request: Request): string =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  request.headers.get("x-real-ip") ??
  "unknown";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request));
  if (!limit.ok) {
    return NextResponse.json(
      { error: "That's a few too many messages for now — please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = ticketEnquirySchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Please check the form and try again." },
      { status: 400 },
    );
  }

  // The honeypot is filled: accept silently so the bot learns nothing from the response.
  if (parsed.data.company) return NextResponse.json({ ok: true });

  const config = mailConfig();
  if (!config) {
    console.error("Ticket enquiry received but mail is not configured — set RESEND_API_KEY, CONTACT_EMAIL_TO and CONTACT_EMAIL_FROM.");
    return NextResponse.json(
      { error: "Email isn't set up yet — please reach us on WhatsApp in the meantime." },
      { status: 503 },
    );
  }

  try {
    await sendEnquiry(parsed.data, config);
  } catch (error) {
    console.error("Failed to send ticket enquiry", error);
    return NextResponse.json(
      { error: "We couldn't send that just now — please try WhatsApp, or try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
