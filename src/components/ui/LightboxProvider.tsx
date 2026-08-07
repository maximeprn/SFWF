"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { PHOTOS, type Photo } from "@/content/photos";
import { LightboxContext } from "./lightbox-context";
import { Lightbox } from "./Lightbox";

interface Shot {
  readonly list: readonly Photo[];
  readonly index: number;
}

export function LightboxProvider({ children }: { readonly children: ReactNode }) {
  const [shot, setShot] = useState<Shot | null>(null);

  /* The whole festival reel is the gallery, so tapping any of the four opens the set and
     can be paged. A one-off src that isn't part of the reel opens on its own. */
  const openPhoto = useCallback((src: string) => {
    const i = PHOTOS.findIndex((p) => p.src === src);
    setShot(
      i >= 0
        ? { list: PHOTOS, index: i }
        : { list: [{ src, caption: "", width: 1200, height: 800 }], index: 0 },
    );
  }, []);

  // The page behind must not scroll while the viewer owns the screen.
  useEffect(() => {
    if (!shot) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [shot]);

  return (
    <LightboxContext.Provider value={openPhoto}>
      {children}
      {shot && (
        <Lightbox list={shot.list} index={shot.index} onClose={() => setShot(null)} />
      )}
    </LightboxContext.Provider>
  );
}
