"use client";

import type { CSSProperties } from "react";
import { Cta } from "@/components/ui/Cta";
import { topicLabel, type Topic } from "@/lib/tickets/schema";

/** Digits only, no +, no spaces — the wa.me format. Unset means no button. */
const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

/**
 * Carries whatever is already typed into WhatsApp, so switching channel never means
 * retyping. Renders nothing when no number is configured — an inert chat button is worse
 * than none.
 */
export function WhatsAppButton({
  name,
  topic,
  message,
  style,
}: {
  readonly name: string;
  readonly topic: Topic;
  readonly message: string;
  readonly style?: CSSProperties;
}) {
  if (!NUMBER) return null;

  const lines = [
    `Hi! I have a question about ${topicLabel(topic).toLowerCase()} for SFWF 2026.`,
    message.trim() && `\n${message.trim()}`,
    name.trim() && `\n— ${name.trim()}`,
  ].filter(Boolean);

  const href = `https://wa.me/${NUMBER}?text=${encodeURIComponent(lines.join(""))}`;

  return <Cta i={2} variant="secondary" label="Ask on WhatsApp" href={href} style={style} />;
}
