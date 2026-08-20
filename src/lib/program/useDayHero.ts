"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DayPick } from "@/components/sections/program/DayFilter";

/** The gap kept between the sticky header's own bottom edge and the landed day block. */
const PICK_GAP = 10;
/** Pull-at-top and re-fold are both ignored this long after a pick, while the programmatic
 * scroll from `land()` is still settling. */
const PEEK_GRACE_MS = 450;
/** Scrolling back down past this many pixels folds a peeked hero away again. */
const REFOLD_Y = 40;
/** How hard an upward wheel has to move to count as a pull. */
const WHEEL_THRESHOLD = -10;
/** How far a finger has to travel downward to count as a pull. */
const TOUCH_THRESHOLD = 26;
/**
 * When the safety check runs — past the 340ms fold and past the smooth scroll it rides with,
 * so it reads a settled page rather than one still in motion.
 */
const LAND_VERIFY_MS = 520;

/**
 * The day pick, the hero's open/folded state, and the scroll choreography around both.
 *
 * The hero belongs to the page's arrival, not to any particular filter: it is up when the
 * reader gets here and gone the moment they choose anything — "all six days" included, since
 * that is just as much a choice as a single day is, and coming back to it should not throw
 * the headline back in the way of the list they are reading. So `heroOpen` keys off *whether*
 * a choice has been made, never off which one.
 *
 * Once it is gone the only way back is the deliberate pull at the top of the page, which is
 * what `heroPeek` records. A pick clears that again, and a route change clears everything for
 * free — `Chrome` keys the page on the route, so this hook's state unmounts with it.
 */
export function useDayHero() {
  const [pick, setPick] = useState<DayPick>("all");
  const [chosen, setChosen] = useState(false);
  const [heroPeek, setHeroPeek] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const pickAtRef = useRef(0);
  const lastYRef = useRef(0);
  const landTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const heroOpen = !chosen || heroPeek;

  /**
   * Where the anchor will come to rest, given how much of the page above it is about to
   * disappear. `shrink` is the height of the folding hero — pass its current height to get
   * the position it *will* have once the fold finishes, or 0 to measure the page as it
   * stands.
   */
  const restingTarget = useCallback((shrink: number): number | null => {
    const anchor = anchorRef.current;
    if (!anchor) return null;
    const header = document.querySelector("header");
    const navHeight = header?.getBoundingClientRect().height ?? 0;
    const railHeight = railRef.current?.getBoundingClientRect().height ?? 0;
    const band = navHeight + railHeight + PICK_GAP;
    return Math.max(0, anchor.getBoundingClientRect().top + window.scrollY - band - shrink);
  }, []);

  /**
   * One movement, not two.
   *
   * The landing position is fully known at the moment of the click: nothing below the anchor
   * can move it, so a one-event day and a four-event day resolve to the same number, and the
   * only thing that *does* move it is the hero collapsing above it. Measuring that height
   * up front and subtracting it means the scroll is aimed at the final position from the
   * first frame — so the page travels straight there while the hero folds, instead of
   * chasing a target that is still moving and visibly overshooting on the way.
   *
   * The delayed pass is a safety net rather than a second animation: on a short document the
   * browser clamps the scroll while the page shrinks, and that is the one case where the aim
   * cannot be honoured. Normally it re-measures the same number and does nothing.
   */
  const land = useCallback(() => {
    clearTimeout(landTimerRef.current);

    const shrink = heroRef.current?.getBoundingClientRect().height ?? 0;
    const target = restingTarget(shrink);
    if (target === null) return;
    if (Math.abs(window.scrollY - target) > 2) {
      window.scrollTo({ top: target, behavior: "smooth" });
    }

    landTimerRef.current = setTimeout(() => {
      const settled = restingTarget(0);
      if (settled !== null && Math.abs(window.scrollY - settled) > 2) {
        window.scrollTo({ top: settled, behavior: "smooth" });
      }
    }, LAND_VERIFY_MS);
  }, [restingTarget]);

  useEffect(() => () => clearTimeout(landTimerRef.current), []);

  /* Every pick lands the same way, "all six days" included: it is the top of the list that is
     being asked for either way. `land` reads the hero's height before React has committed the
     fold, which is what makes the subtraction correct — at this point the DOM still shows the
     hero at whatever height it currently has. */
  const onPick = useCallback(
    (day: DayPick) => {
      setPick(day);
      setChosen(true);
      setHeroPeek(false);
      pickAtRef.current = Date.now();
      lastYRef.current = window.scrollY;
      land();
    },
    [land],
  );

  /* Pull-at-top brings the week back; scrolling down past 40px folds it away again. This has
     to read the gesture, not the scroll position: folding the hero shrinks the document, the
     browser clamps the scroll, and that clamp is indistinguishable from "scrolled to the
     top" — position-based logic re-triggers the reveal in a loop. */
  useEffect(() => {
    const peek = () => {
      if (heroOpen) return;
      if (window.scrollY > 2 || Date.now() - pickAtRef.current < PEEK_GRACE_MS) return;
      setHeroPeek(true);
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < WHEEL_THRESHOLD) peek();
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchY;
      if (y - touchY > TOUCH_THRESHOLD) peek();
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (
        heroPeek &&
        Date.now() - pickAtRef.current > PEEK_GRACE_MS &&
        y > REFOLD_Y &&
        y > lastYRef.current + 6
      ) {
        setHeroPeek(false);
      }
      lastYRef.current = y;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [heroOpen, heroPeek]);

  return { pick, onPick, heroOpen, anchorRef, railRef, heroRef };
}
