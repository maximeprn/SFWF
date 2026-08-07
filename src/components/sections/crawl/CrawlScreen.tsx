import Link from "next/link";
import { Bubble, Prose } from "@/components/ui/Bubble";
import { Doodle } from "@/components/ui/Doodle";
import { PassportCard } from "@/components/ui/PassportCard";
import { Photo } from "@/components/ui/Photo";
import { CRAWLS, CRAWL_KEYS } from "@/content/crawls";
import { PHOTOS } from "@/content/photos";
import type { CrawlKey } from "@/content/types";
import { CrawlMechanics } from "./CrawlMechanics";
import { CrawlPartners } from "./CrawlPartners";

/** An unstamped passport page — one ring per stop. */
function StampRow({ count }: { readonly count: number }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1.5px dashed var(--on-bg-soft)",
            display: "grid",
            placeItems: "center",
            font: "var(--text-caption)",
            fontSize: 10,
            color: "var(--on-bg-soft)",
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

/**
 * Both crawls share one screen shape, because they share one passport — two near-identical
 * pages would be the 2025 site's mistake repeated. The switch is a pair of links rather
 * than local state, so each crawl is its own indexable URL.
 */
export function CrawlScreen({ which }: { readonly which: CrawlKey }) {
  const crawl = CRAWLS[which];

  return (
    <div
      style={{
        padding: "var(--gap) var(--gutter) 44px",
        display: "flex",
        flexDirection: "column",
        gap: 64,
      }}
    >
      <header style={{ position: "relative" }}>
        <h1 style={{ margin: 0, font: "var(--display-2)", color: "var(--on-bg)", textShadow: "var(--text-shadow-on-dye-strong)" }}>
          Food Crawl
        </h1>
        <p style={{ margin: "10px 0 0", font: "var(--text-body-sm)", color: "var(--on-bg-soft)", textShadow: "var(--text-shadow-on-dye)" }}>
          Your Passport to Discovering Siargao&rsquo;s Flavors
        </p>
        <span className="wide:hidden">
          <Doodle icon="coffee-beans" size={44} rot={-12} op={0.72} right={-6} bottom={-46} />
        </span>
      </header>

      {/* Intro, the passport it describes, and its photo: one section, tight inside. */}
      <section style={{ marginTop: -40, display: "flex", flexDirection: "column", gap: 20 }}>
        <Prose i={0} style={{ maxWidth: "var(--prose)" }}>
          <p style={{ margin: 0, font: "var(--text-body)", color: "var(--on-bg)" }}>
            From rich, aromatic coffees to comforting karinderya classics, your Food Crawl Passport is
            the key to exploring the island&rsquo;s most authentic tastes. Drink, dine, and discover the
            people who make Siargao&rsquo;s food scene unforgettable.
          </p>
        </Prose>
        <PassportCard i={3} />
        <Photo i={1} src={PHOTOS[3]!.src} alt={PHOTOS[3]!.caption} h={186} />
      </section>

      <CrawlMechanics />

      <section>
        <nav aria-label="Choose a crawl" style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {CRAWL_KEYS.map((key, i) => {
            const on = key === which;
            return (
              <Link key={key} href={`/food-crawl/${key}`} style={{ textDecoration: "none" }} aria-current={on ? "page" : undefined}>
                <Bubble
                  i={i}
                  fill={on ? "var(--mark)" : undefined}
                  style={{
                    padding: "10px 18px",
                    font: "var(--text-h3)",
                    whiteSpace: "nowrap",
                    color: on ? "var(--ink-deep)" : "var(--bubble-ink)",
                    transition: `background var(--open) var(--ease), color var(--open) var(--ease)`,
                  }}
                >
                  {CRAWLS[key].tab}
                </Bubble>
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 52, display: "flex", flexDirection: "column", gap: 26 }}>
          <h2 style={{ margin: 0, font: "var(--display-3)", color: "var(--on-bg)", textShadow: "var(--text-shadow-on-dye-strong)" }}>
            {crawl.heading}
          </h2>
          <Prose i={2} style={{ maxWidth: "var(--prose)" }}>
            <p style={{ margin: 0, font: "var(--text-body-sm)", color: "var(--on-bg)" }}>{crawl.intro}</p>
          </Prose>

          <div>
            <p
              style={{
                margin: "0 0 10px",
                font: "var(--text-caption)",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
                color: "var(--on-bg-soft)",
                textShadow: "var(--text-shadow-on-dye)",
              }}
            >
              {crawl.venues.length} stamps to collect
            </p>
            <StampRow count={crawl.venues.length} />
            <p
              style={{
                margin: "16px 0 0",
                font: "var(--text-body-sm)",
                color: "var(--on-bg-soft)",
                maxWidth: "var(--prose)",
                textShadow: "var(--text-shadow-on-dye)",
              }}
            >
              {crawl.task} {crawl.prize}
            </p>
          </div>

          <CrawlPartners crawl={crawl} />
        </div>
      </section>
    </div>
  );
}
