"use client";

import { useEffect, useState } from "react";

/**
 * Renders a full-bleed autoplaying video background on desktop (≥768px).
 * On mobile the component returns null — the video element is never mounted,
 * so no media bytes are requested on smaller viewports.
 */
export default function HeroBackground() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // null while viewport is unknown (SSR / first paint) — prevents hydration
  // mismatch and avoids any network request before we know the viewport.
  if (!isDesktop) return null;

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      poster="/images/hero-poster.jpg"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: 0,
      }}
    >
      <source src="/videos/hero-bg.mp4" type="video/mp4" />
    </video>
  );
}
