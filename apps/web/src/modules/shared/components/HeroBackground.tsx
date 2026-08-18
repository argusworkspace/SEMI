"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * HeroBackground
 *
 * Auto-advancing showcase slideshow (replaces the old hero video). Every
 * image is stacked in the same box and crossfaded via opacity, so nothing
 * needs to re-mount or reflow when the active slide changes — smoother than
 * swapping `src` on a single <img>, and works identically on every screen
 * size (no separate mobile/desktop path like the video needed).
 *
 * next/image with `fill` + `sizes="100vw"` lets the browser fetch a
 * device-appropriate width instead of always downloading the full 1920px
 * asset — the actual "adapt to every screen" optimization. Only the first
 * slide is `priority` (eager, no lazy delay) so it doesn't block LCP; the
 * rest load lazily since they're already in view but not yet visible.
 */
const SHOWCASE_IMAGES = [
  "/images/showcase/showcase-1.webp",
  "/images/showcase/showcase-2.webp",
  "/images/showcase/showcase-3.webp",
  "/images/showcase/showcase-4.webp",
  "/images/showcase/showcase-5.webp",
  "/images/showcase/showcase-6.webp",
];

const SLIDE_INTERVAL_MS = 2000;
const FADE_MS = 900;

export default function HeroBackground() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SHOWCASE_IMAGES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      {SHOWCASE_IMAGES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center 40%",
            opacity: i === index ? 1 : 0,
            transition: reducedMotion ? "none" : `opacity ${FADE_MS}ms ease`,
          }}
        />
      ))}
    </div>
  );
}
