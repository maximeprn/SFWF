"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DayPick } from "@/components/sections/program/DayFilter";
import { glide } from "@/lib/chrome/glide";

/** The gap kept between the sticky header's own bottom edge and the landed day block. */
const PICK_GAP = 10;
/**
 * The pull is ignored this long after a pick, while `land()`'s own scroll is still settling.
 * It has to outlast the glide, which is now the longer half of the choreography rather than
 * the browser's own quick one — see `glide`'s ceiling.
 */
const PEEK_GRACE_MS = 1400;
/**
 * How much upward travel, with the page already sitting at the top, adds up to asking for the
 * week back.
 *
 * It used to be a threshold on a single event — 26px of finger, one wheel notch — which is
 * less than an ordinary scroll delivers. So scrolling up to re-read the top of the list threw
 * 280px of hero open under the reader's thumb, and the page appeared to take itself over. A
 * budget instead of a threshold makes the gesture the deliberate one the design asks for: the
 * page has to be at the top *and* the reader has to keep pulling against a page that has
 * nowhere left to go, which is the same thing every pull-to-refresh in the world asks for.
 */
const PULL_BUDGET = 120;
/** A gap this long with nothing pulled starts the budget over. */
const PULL_RESET_MS = 400;
/**
 * How long the page has to have been at the top before a pull counts at all.
 *
 * A flick that ends at the top keeps delivering momentum after it arrives, and that momentum
 * is not the reader asking for anything — without this it spends the whole budget on its own.
 */
const PULL_SETTLE_MS = 250;
/**
 * The day pick, the hero's open/folded state, and the scroll choreography around both.
 *
 * The hero belongs to the page's arrival, not to any particular filter: it is up when the
 * reader gets here and gone the moment they choose anything — "all six days" included, since
 * that is just as much a choice as a single day is, and coming back to it should not throw
 * the headline back in the way of the list they are reading. So `heroOpen` keys off *whether*
 * a choice has been made, never off which one.
 *
 * Once it is gone the only way back is the deliberate pull at the top of the page — a
 * budget of travel spent against a page that has nowhere left to go, not a threshold an
 * ordinary scroll crosses by accident — which is what `heroPeek` records. A pick clears that again, and a route change clears everything for
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
  const glideRef = useRef<(() => void) | undefined>(undefined);

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
   * The second pass is a safety net rather than a second animation: on a short document the
   * scroll is clamped while the page shrinks, and that is the one case where the aim cannot be
   * honoured. It is hung off the first glide's arrival rather than off a timer, so it reads a
   * page that has genuinely settled instead of one guessed to have settled by now — and it
   * never runs at all if the reader interrupted the glide, because then the page is where they
   * put it and not where we aimed it.
   */
  const land = useCallback(() => {
    glideRef.current?.();

    const shrink = heroRef.current?.getBoundingClientRect().height ?? 0;
    const target = restingTarget(shrink);
    if (target === null) return;

    glideRef.current = glide(target, () => {
      const settled = restingTarget(0);
      if (settled !== null && Math.abs(window.scrollY - settled) > 2) {
        glideRef.current = glide(settled);
      }
    });
  }, [restingTarget]);

  useEffect(() => () => glideRef.current?.(), []);

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
      land();
    },
    [land],
  );

  /* Pulling at the top brings the week back, and that is the end of it — the page goes to the
     very top and behaves like an ordinary page again until the next pick.

     It reads the gesture rather than the scroll position because folding the hero shrinks the
     document, the browser clamps the scroll to the new bottom, and that clamp is
     indistinguishable from "the reader scrolled to the top" — position-based logic re-triggers
     the reveal in a loop.

     Nothing re-folds on the way down. Scrolling down used to put the hero away again past 40px,
     which meant the first downward flick after asking for the week took it straight back: the
     reveal could not be read without fighting it. A pick is the thing that folds the hero, so a
     pick is the only thing that folds it. */
  useEffect(() => {
    let pulled = 0;
    let pulledAt = 0;
    /* When the page was last seen anywhere but the top. */
    let leftTopAt = Date.now();

    const pull = (travelled: number) => {
      if (heroOpen) return;
      /* Not at the top, or the landing glide from a pick is still settling: neither is a pull,
         and both start the budget over. */
      if (window.scrollY > 2) {
        leftTopAt = Date.now();
        pulled = 0;
        return;
      }
      const now = Date.now();
      if (now - pickAtRef.current < PEEK_GRACE_MS || now - leftTopAt < PULL_SETTLE_MS) return;
      if (now - pulledAt > PULL_RESET_MS) pulled = 0;
      pulledAt = now;
      pulled += travelled;
      if (pulled < PULL_BUDGET) return;

      pulled = 0;
      setHeroPeek(true);
      /* Land on the top rather than wherever the pull happened to stop. The hero opens above
         the reading position, and a couple of pixels of offset is enough to cut its first
         line. At most two of them, since a pull only counts at the top at all. */
      glideRef.current?.();
      glideRef.current = glide(0);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) pull(-e.deltaY);
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
      /* One pull is one gesture. Lifting off and starting again starts the budget again. */
      pulled = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchY;
      const travelled = y - touchY;
      touchY = y;
      /* A finger moving *down* the screen is the page moving up. */
      if (travelled > 0) pull(travelled);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [heroOpen]);

  return { pick, onPick, heroOpen, anchorRef, railRef, heroRef };
}
