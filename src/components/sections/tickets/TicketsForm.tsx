"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bubble } from "@/components/ui/Bubble";
import { Cta } from "@/components/ui/Cta";
import { Field } from "@/components/ui/Field";
import { TOPICS, ticketEnquirySchema, topicLabel, type Topic } from "@/lib/tickets/schema";
import { WhatsAppButton } from "./WhatsAppButton";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const isTopic = (v: string | null): v is Topic =>
  TOPICS.some((t) => t.value === v);

/**
 * The enquiry form. Nothing is sold online — the ₱500 passport is sold in person at Sayak
 * Airport and partner venues — so this asks a question rather than taking a payment.
 *
 * Both routes out are offered side by side: send it as an email, or carry the same message
 * into WhatsApp without retyping it.
 */
export function TicketsForm() {
  const params = useSearchParams();
  const initialTopic = params.get("topic");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<Topic>(isTopic(initialTopic) ? initialTopic : "passport");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [failure, setFailure] = useState<string | null>(null);

  const submit = async () => {
    setFailure(null);
    const parsed = ticketEnquirySchema.safeParse({ name, email, topic, message, company });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "name" || key === "email" || key === "message") next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setState("sending");
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFailure(body.error ?? "Something went wrong. Please try WhatsApp instead.");
        setState("idle");
        return;
      }
      setState("sent");
    } catch {
      setFailure("We couldn't reach the server. Please try WhatsApp instead.");
      setState("idle");
    }
  };

  if (state === "sent") {
    return (
      <Bubble i={1} style={{ maxWidth: 560 }}>
        <h2 style={{ margin: 0, font: "var(--display-4)", color: "var(--bubble-ink)" }}>
          Thanks — that&rsquo;s with us.
        </h2>
        <p style={{ margin: "10px 0 0", font: "var(--text-body-sm)", color: "var(--bubble-soft)" }}>
          We reply to <strong>{email}</strong>, usually within a couple of days. If it&rsquo;s
          urgent, WhatsApp is faster.
        </p>
        <WhatsAppButton name={name} topic={topic} message={message} style={{ marginTop: 16 }} />
      </Bubble>
    );
  }

  return (
    <Bubble i={1} style={{ maxWidth: 560 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Your name" error={errors.name}>
          {(p) => <input {...p} type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />}
        </Field>

        <Field label="Email" error={errors.email}>
          {(p) => <input {...p} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />}
        </Field>

        <Field label="What's it about">
          {(p) => (
            <select {...p} value={topic} onChange={(e) => setTopic(e.target.value as Topic)}>
              {TOPICS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Message" error={errors.message}>
          {(p) => <textarea {...p} rows={5} value={message} onChange={(e) => setMessage(e.target.value)} style={{ ...p.style, resize: "vertical" }} />}
        </Field>

        {/* Honeypot: off-screen rather than display:none, which some bots detect. */}
        <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
          <label htmlFor="sfwf-company">Company</label>
          <input id="sfwf-company" type="text" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>

        {failure && (
          <p role="alert" style={{ margin: 0, font: "var(--text-body-sm)", color: "#9C3F21" }}>
            {failure}
          </p>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <Cta i={0} label={state === "sending" ? "Sending…" : "Send message"} onClick={submit} />
          <WhatsAppButton name={name} topic={topic} message={message} />
        </div>

        <p style={{ margin: 0, font: "var(--text-caption)", color: "var(--bubble-soft)" }}>
          We use your email only to reply about {topicLabel(topic).toLowerCase()}.
        </p>
      </div>
    </Bubble>
  );
}
