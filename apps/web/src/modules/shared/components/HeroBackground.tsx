"use client";

import { useState, useEffect } from "react";

/**
 * HeroBackground
 *
 * All screen sizes: renders a looping, muted <video> that fills the hero
 *   section. Uses objectFit "cover" with objectPosition "center center" so
 *   the center of the frame is always visible.
 *
 * Mobile: `playsInline` is required for autoplay on iOS Safari.
 *         `muted` is required for autoplay on all browsers without user gesture.
 *
 * SSR: returns null until mounted (avoids hydration mismatch).
 */
export default function HeroBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid SSR/hydration mismatch — render only after mount
  if (!mounted) return null;

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      poster="/images/hero-poster.jpg"
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center center",
        // Above poster (z-index 0), below dark overlay (z-index 2)
        zIndex: 1,
      }}
    >
      <source src="/videos/hero-bg.mp4" type="video/mp4" />
    </video>
  );
}
