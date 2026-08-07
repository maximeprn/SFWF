"use client";

import { useEffect, type RefObject } from "react";

/** Where on screen a block has to reach before it reveals. */
const TRIGGER = 0.7;
/** Nothing reveals for this long after mount, so arriving mid-story isn't a burst. */
const ARM_MS = 700;
const CASCADE_START = 140;
const CASCADE_STEP = 680;
/** The root system draws for 4.2s, so whatever follows it waits. */
const CASCADE_ROOTS = 2300;

/**
 * Drives the story's reveals off one scroll listener, adding `.on` to each `.rv` block as
 * it crosses the trigger line. The animation itself is entirely CSS.
 *
 * The cascade branch handles blocks that can never cross the line because the page has
 * run out underneath them: once scrolling has bottomed out, the tail is released on a
 * paced timer instead — last bubble, roots, payoff line — rather than all at once.
 */
export function useStoryReveal(host: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = host.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>(".rv"));
    let queue = CASCADE_START;
    let armed = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const tick = () => {
      const viewport = window.innerHeight;
      const line = viewport * TRIGGER;
      const atEnd =
        window.scrollY + viewport >= document.documentElement.scrollHeight - 6;

      for (const el of items) {
        if (el.classList.contains("on") || el.dataset.queued) continue;
        const top = el.getBoundingClientRect().top;
        if (armed && atEnd && top < viewport) {
          el.dataset.queued = "1";
          const at = queue;
          timers.push(setTimeout(() => el.classList.add("on"), at));
          queue = at + (el.querySelector("svg.roots") ? CASCADE_ROOTS : CASCADE_STEP);
        } else if (top < line) {
          el.classList.add("on");
        }
      }
    };

    tick();
    const arm = setTimeout(() => {
      tick();
      armed = true;
    }, ARM_MS);

    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(arm);
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
  }, [host]);
}
