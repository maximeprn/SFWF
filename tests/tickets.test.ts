import { describe, expect, it } from "vitest";
import { TOPICS, ticketEnquirySchema, topicLabel } from "@/lib/tickets/schema";
import { rateLimit } from "@/lib/tickets/rate-limit";

const valid = {
  name: "Ana Cruz",
  email: "ana@example.com",
  topic: "passport" as const,
  message: "We're six people — is there a group rate for the opening gala?",
};

describe("enquiry validation", () => {
  it("accepts a well-formed enquiry", () => {
    expect(ticketEnquirySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a malformed email with a message a visitor can act on", () => {
    const result = ticketEnquirySchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    expect(result.error!.issues[0]!.message).toMatch(/email/i);
  });

  it("rejects a message too short to answer", () => {
    const result = ticketEnquirySchema.safeParse({ ...valid, message: "hi" });
    expect(result.success).toBe(false);
  });

  it("rejects an over-long message rather than mailing it", () => {
    const result = ticketEnquirySchema.safeParse({ ...valid, message: "x".repeat(2001) });
    expect(result.success).toBe(false);
  });

  it("rejects a topic that isn't one of the offered options", () => {
    const result = ticketEnquirySchema.safeParse({ ...valid, topic: "hacking" });
    expect(result.success).toBe(false);
    // The visitor picks from a <select>, so a bad value means tampering — the message must
    // stay human rather than leaking the validator's internals.
    expect(result.error!.issues[0]!.message).not.toMatch(/expected one of/i);
  });

  it("trims surrounding whitespace instead of counting it as content", () => {
    const result = ticketEnquirySchema.safeParse({ ...valid, name: "   Ana   " });
    expect(result.success && result.data.name).toBe("Ana");
  });

  it("accepts a filled honeypot so the bot learns nothing from the response", () => {
    // Rejecting here would tell a bot the field is checked. The route drops it silently.
    const result = ticketEnquirySchema.safeParse({ ...valid, company: "SpamCo" });
    expect(result.success).toBe(true);
    expect(result.success && result.data.company).toBe("SpamCo");
  });

  it("labels every offered topic", () => {
    for (const topic of TOPICS) {
      expect(topicLabel(topic.value)).toBe(topic.label);
    }
  });
});

describe("rate limit", () => {
  it("allows a normal burst then holds the sender off", () => {
    const key = "test-client-a";
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(key).ok, `request ${i + 1} should pass`).toBe(true);
    }
    const blocked = rateLimit(key);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("counts each sender separately", () => {
    const a = "test-client-b";
    const b = "test-client-c";
    for (let i = 0; i < 5; i++) rateLimit(a);
    expect(rateLimit(a).ok).toBe(false);
    expect(rateLimit(b).ok).toBe(true);
  });
});
