"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void): (() => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

const getSnapshot = (): boolean => window.matchMedia(QUERY).matches;

/**
 * Reads the visitor's motion preference as a subscription rather than a one-shot effect, so
 * it also reacts if they change the setting with the page open.
 *
 * The server snapshot is `false` — motion is the design's default, and the client corrects
 * on hydration before any animation has had time to matter.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
