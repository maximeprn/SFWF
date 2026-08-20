"use client";

import { useEffect } from "react";
import { bindPressSystem } from "@/lib/ui/pressSystem";

/** Renders nothing — it only binds the one global press system, once, for the page's life. */
export function PressSystem() {
  useEffect(bindPressSystem, []);
  return null;
}
