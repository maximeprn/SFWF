"use client";

import { createContext, useContext } from "react";

/**
 * Any Photo on any screen can hand a src up to the viewer without threading props through
 * every section. Null when no provider is mounted, in which case photos are not zoomable.
 */
export const LightboxContext = createContext<((src: string) => void) | null>(null);

export const useLightbox = (): ((src: string) => void) | null =>
  useContext(LightboxContext);
