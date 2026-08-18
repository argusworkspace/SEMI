"use client";

import { useState, useEffect } from "react";

export default function HeroBackground() {
  const [mounted, setMounted] = useState(false);

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
