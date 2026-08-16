"use client";

import { useState, useEffect } from "react";

/**
 * Renders a full-bleed autoplaying video background for all viewports.
 * Mobile browsers (iOS Safari 10+, Chrome Android) support muted inline
 * autoplay when `playsInline` + `muted` are set — exactly what we have.
 * The static poster image remains visible until the video loads.
 */
export default function HeroBackground() {
  const [mounted, setMounted] = useState(false);

  // Defer mount to avoid SSR/hydration mismatch — same pattern as before
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
