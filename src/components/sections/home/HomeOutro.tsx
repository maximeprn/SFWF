"use client";

import { useState } from "react";
import { Bubble, Prose } from "@/components/ui/Bubble";
import { PassportCard } from "@/components/ui/PassportCard";
import { STATS } from "@/content/site";

/**
 * The stat pair and the crawl promo. Numbers are sparse and honest — the festival publishes
 * four stats and only two carry a figure, so only those two are shown rather than padding
 * the row out to a tidy four.
 */
export function HomeOutro() {
  const [passportOpen, setPassportOpen] = useState(false);

  return (
    <section
      style={{
        padding: "var(--sec) var(--gutter) 48px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sec)",
      }}
    >
      <div style={{ position: "relative", display: "flex", gap: 12 }}>
        {STATS.map((stat, i) => (
          <Bubble key={stat.label} i={i + 1} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ font: "var(--display-2)", color: "var(--bubble-ink)" }}>{stat.value}</div>
            <div
              style={{
                font: "var(--text-caption)",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
                color: "var(--bubble-soft)",
                marginTop: 2,
              }}
            >
              {stat.label}
            </div>
          </Bubble>
        ))}
      </div>

      <Prose i={3}>
        <h2 style={{ margin: 0, font: "var(--display-4)", color: "var(--on-bg)" }}>
          Join our Coffee Crawl &amp; Suroy Suroy sa Karinderya
        </h2>
        <p style={{ margin: "8px 0 0", font: "var(--text-body-sm)", color: "var(--on-bg-soft)" }}>
          Discover our island cafes and eateries and stamp your way to cool freebies and collectibles!
        </p>
        {/* The button itself grows into the card, on the programme bubbles' timing. */}
        <PassportCard
          i={4}
          label="See how the crawls work"
          open={passportOpen}
          onToggle={() => setPassportOpen((v) => !v)}
          style={{ marginTop: 16 }}
        />
      </Prose>
    </section>
  );
}
