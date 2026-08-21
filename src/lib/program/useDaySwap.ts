"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { DayPick } from "@/components/sections/program/DayFilter";

/**
 * How long the outgoing day has to leave. Short on purpose: the rail already answers the
 * click on the frame it happens — the chip lights, the hero folds, the page starts moving —
 * so this is the one part of the response nobody is waiting on. It clears rather than lingers.
 */
const OUT_MS = 300;

/** Leaving runs on the site's own curve, which drops away immediately and settles late. */
const OUT = `opacity ${OUT_MS}ms var(--ease)`;

/**
 * Arriving is the slower half, and on the gentler curve — the same one the hero's reveal uses.
 * A day list is a page's worth of reading that appeared without being scrolled to, and at the
 * site's 340ms it lands as a cut. Running it at roughly twice the exit is what makes the two
 * read as one movement rather than two: the eye follows the empty ground across, then the new
 * day settles onto it.
 *
 * The number to tune if it still reads fast is this one; `OUT_MS` should stay well under it.
 */
const IN = "opacity .68s cubic-bezier(.25,.5,.2,1)";

/** The list's own fade, written the way `foldStyle` is — a function, not a class. */
export function swapStyle(lit: boolean, reduced: boolean): CSSProperties {
  return {
    opacity: lit ? 1 : 0,
    transition: reduced ? "none" : lit ? IN : OUT,
  };
}

/**
 * The day the list is *showing*, held one fade behind the day the rail is *set to*.
 *
 * Picking a chip changes three things at once — which day is listed, which bubbles are open,
 * and how tall the page is — and all three used to land on the frame of the click. That is
 * the flash: sixteen bubbles become four, four open details vanish without closing, and the
 * document loses most of its height, with nothing in between to read it as a change of view
 * rather than a glitch.
 *
 * So the swap waits for the list to be gone. Everything that *answers* the click stays on the
 * click — the chip, the fold, the scroll — and everything that *replaces content* happens
 * inside `commit`, under an opacity of 0, where a height snapping and details unmounting cost
 * nothing to look at.
 *
 * This is not the "no fade-ins" the design rules out. That is ambience — a thing fading in
 * because it was scrolled past. This is a fade the reader asked for by clicking, which is the
 * same thing the hero fold already is.
 */
export function useDaySwap(
  reduced: boolean,
  onSwap: (day: DayPick) => void,
): { readonly showing: DayPick; readonly lit: boolean; readonly swapTo: (day: DayPick) => void } {
  /* Starts on the week because the page does — the same place `useDayHero` starts `pick`. */
  const [showing, setShowing] = useState<DayPick>("all");
  const [lit, setLit] = useState(true);
  const settled = useRef<DayPick>("all");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const swap = useRef(onSwap);

  /* The caller rebuilds this closure every render, and the timeout below can only fire between
     renders, so the newest one is always the right one to run. */
  useEffect(() => {
    swap.current = onSwap;
  });

  useEffect(() => () => clearTimeout(timer.current), []);

  const swapTo = useCallback(
    (day: DayPick) => {
      /* Re-picking the chip already showing, with no fade in flight: nothing is changing, so
         nothing should blink. */
      if (day === settled.current && timer.current === undefined) return;

      const commit = () => {
        timer.current = undefined;
        settled.current = day;
        setShowing(day);
        /* In the same batch as the swap, never in an effect after it. This is what decides
           whether the arriving day's bubbles are open, and a frame late would draw that day
           shut once and then pop it open. */
        swap.current(day);
        setLit(true);
      };

      clearTimeout(timer.current);
      if (reduced) {
        commit();
        return;
      }
      setLit(false);
      /* A second pick mid-fade restarts the wait rather than shortening it. The list is already
         dark, so another `OUT_MS` costs only the wait, where cutting the fade short to catch
         up would put the flash back. */
      timer.current = setTimeout(commit, OUT_MS);
    },
    [reduced],
  );

  return { showing, lit, swapTo };
}
