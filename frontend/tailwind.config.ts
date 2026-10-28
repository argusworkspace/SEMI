import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Brand colors ──────────────────────────────────────────────────────
      colors: {
        asphalt:  "#1C1F22", // header / nav / footer bg, primary text
        paper:    "#F6F4EF", // page background
        volt:     "#C8F135", // primary accent — main CTAs & Pay Advance ONLY
        amber:    "#E8772E", // secondary accent — Learn More / secondary actions
        steel:    "#5B6470", // labels, captions, spec keys
        hairline: "#DEDAD0", // borders / dividers
      },

      // ── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body:    ["var(--font-inter)", "sans-serif"],
      },

      fontSize: {
        // [font-size, { lineHeight }]
        "h1":      ["44px", { lineHeight: "52px", fontWeight: "700" }],
        "h2":      ["30px", { lineHeight: "38px", fontWeight: "600" }],
        "h3":      ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body":    ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "caption": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "spec-label": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },

      letterSpacing: {
        "spec": "0.08em", // tracked-wide for spec-label uppercase
      },

      // ── Layout ────────────────────────────────────────────────────────────
      maxWidth: {
        layout: "1200px",
      },

      padding: {
        mobile:  "20px",
        desktop: "64px",
      },

      // ── Borders & Radius ──────────────────────────────────────────────────
      borderRadius: {
        // 2px everywhere — sharp spec-plate feel
        DEFAULT: "2px",
        none: "0px",
        sm:   "2px",
        md:   "2px",
        lg:   "2px",
        xl:   "2px",
        "2xl": "2px",
        full: "9999px", // kept for pill/avatar shapes if ever needed
      },

      borderColor: {
        DEFAULT: "#DEDAD0",
      },

      // ── Shadows: intentionally empty ──────────────────────────────────────
      // Per spec: No box-shadows. Use 1px solid hairline borders instead.
      boxShadow: {
        none: "none",
        DEFAULT: "none",
        sm: "none",
        md: "none",
        lg: "none",
        xl: "none",
        "2xl": "none",
        inner: "none",
      },
    },
  },
  plugins: [],
};

export default config;
