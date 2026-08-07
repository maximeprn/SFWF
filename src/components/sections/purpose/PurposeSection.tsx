"use client";

import { useRef, type ReactNode } from "react";
import { Cta } from "@/components/ui/Cta";
import { Connector } from "./Connector";
import { RootsMark } from "./RootsMark";
import { StoryBubble } from "./StoryBubble";
import { useStoryReveal } from "./useStoryReveal";
import {
  DEAD_END,
  PROBLEM_CONNECTORS,
  PROBLEM_STEPS,
  PURPOSE_COPY,
  SOLUTION_CONNECTORS,
  SOLUTION_STEPS,
  type Connector as ConnectorData,
  type StoryStep,
} from "./story";

/**
 * How each half of the argument opens: a big gold numeral against a hairline, then the
 * chapter's own heading and the copy that frames the bubbles below it.
 */
function Chapter({
  n,
  title,
  intro,
  margin,
}: {
  readonly n: string;
  readonly title: string;
  readonly intro: string;
  readonly margin: string;
}) {
  return (
    <>
      <div className="rv" style={{ display: "flex", alignItems: "center", gap: 12, margin }}>
        <span style={{ font: "400 30px/1 var(--font-display)", color: "var(--mark)" }}>{n}</span>
        <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,.28)" }} />
      </div>
      <div className="rv" style={{ margin: "0 0 22px", textShadow: "var(--text-shadow-on-dye)" }}>
        <h3 style={{ margin: 0, font: "var(--display-3)", color: "var(--on-bg)", textWrap: "pretty" }}>
          {title}
        </h3>
        <p style={{ margin: "12px 0 0", font: "var(--text-body-sm)", color: "var(--on-bg-soft)", textWrap: "pretty" }}>
          {intro}
        </p>
      </div>
    </>
  );
}

/** Bubbles and the stems between them, interleaved. */
function Chain({
  steps,
  connectors,
  tail,
}: {
  readonly steps: readonly StoryStep[];
  readonly connectors: readonly ConnectorData[];
  readonly tail?: ReactNode;
}) {
  return (
    <>
      {steps.map((step, i) => (
        <div key={step.title}>
          <StoryBubble step={step} />
          {connectors[i] && <Connector c={connectors[i]!} />}
        </div>
      ))}
      {tail}
    </>
  );
}

/**
 * The purpose story. Ships open rather than folded behind a button: it is the strongest
 * argument the festival makes, and hiding it behind a tap cost more than it saved.
 *
 * data-nav-anchor reserves the nav's gap at the top, so reading up into the story brings
 * the band back.
 */
export function PurposeSection() {
  const root = useRef<HTMLElement>(null);
  useStoryReveal(root);

  return (
    <section
      ref={root}
      className="purpose"
      data-nav-anchor
      style={{ padding: "var(--nav-h) var(--gutter) 0" }}
    >
      <div style={{ textShadow: "var(--text-shadow-on-dye)", maxWidth: "var(--prose)" }}>
        <p
          style={{
            margin: 0,
            font: "var(--text-eyebrow)",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "var(--tracking-eyebrow)",
            textTransform: "uppercase",
            color: "var(--mark)",
          }}
        >
          {PURPOSE_COPY.eyebrow}
        </p>
        {/* The statement only. What elaborates it now belongs to chapter 01, so the two
            chapters open identically instead of one arriving mid-paragraph. */}
        <h2 style={{ margin: "16px 0 0", font: "var(--display-2)", color: "var(--on-bg)", textWrap: "pretty" }}>
          {PURPOSE_COPY.title}
        </h2>
      </div>

      {/* The line itself is narrow on any screen — it reads as a single thread, so it does
          not widen with the column the way prose does. */}
      <div style={{ paddingTop: 12, maxWidth: 560 }}>
        <Chapter
          n="01"
          title={PURPOSE_COPY.problemTitle}
          intro={PURPOSE_COPY.problemIntro}
          margin="44px 0 20px"
        />
        <Chain
          steps={PROBLEM_STEPS}
          connectors={PROBLEM_CONNECTORS}
          tail={
            <div
              className="rv"
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, margin: "2px 0 0 44px" }}
            >
              <Connector c={DEAD_END} />
              <span
                style={{
                  font: "var(--display-3)",
                  color: "var(--on-bg)",
                  maxWidth: 290,
                  textWrap: "pretty",
                  textShadow: "var(--text-shadow-on-dye-strong)",
                }}
              >
                {PURPOSE_COPY.deadEnd}
              </span>
            </div>
          }
        />

        <Chapter
          n="02"
          title={PURPOSE_COPY.solutionTitle}
          intro={PURPOSE_COPY.solutionIntro}
          margin="52px 0 20px"
        />

        <Chain steps={SOLUTION_STEPS} connectors={SOLUTION_CONNECTORS} tail={<RootsMark />} />

        <div className="rv">
          <span
            style={{
              display: "block",
              margin: "16px 0 0 4px",
              maxWidth: 300,
              font: "var(--display-3)",
              color: "var(--on-bg)",
              textWrap: "pretty",
              textShadow: "var(--text-shadow-on-dye-strong)",
            }}
          >
            {PURPOSE_COPY.payoff}
          </span>
        </div>

        <div className="rv" style={{ margin: "40px 0 0", textShadow: "var(--text-shadow-on-dye)" }}>
          <p style={{ margin: 0, font: "var(--text-body)", color: "var(--on-bg)", textWrap: "pretty" }}>
            {PURPOSE_COPY.closing}
          </p>
          <Cta i={0} label="Get your tickets" href="/tickets" style={{ marginTop: 20 }} />
        </div>
      </div>
    </section>
  );
}
