/**
 * SEMY Design Tokens
 *
 * Single source of truth for all brand constants.
 * The Tailwind v4 @theme block in globals.css mirrors every token here.
 * Import these in components for type-safe inline styles.
 */

// ── Colors ────────────────────────────────────────────────────────────────────

/** Header / nav / footer background; primary text */
export const COLOR_ASPHALT = "#1C1F22";

/** Page background — warm off-white */
export const COLOR_PAPER = "#F6F4EF";

/** Primary accent — main CTAs and the Pay Advance button ONLY */
export const COLOR_VOLT = "#C8F135";

/** Secondary accent — Learn More / secondary actions */
export const COLOR_AMBER = "#E8772E";

/** Labels, captions, spec keys */
export const COLOR_STEEL = "#5B6470";

/** Borders and dividers */
export const COLOR_HAIRLINE = "#DEDAD0";

// ── Typography ────────────────────────────────────────────────────────────────

export const FONT_DISPLAY = "var(--font-space-grotesk)";
export const FONT_BODY    = "var(--font-inter)";

export const TYPE_SCALE = {
  h1:        { fontSize: "44px", lineHeight: "52px", fontWeight: 700 },
  h2:        { fontSize: "30px", lineHeight: "38px", fontWeight: 600 },
  h3:        { fontSize: "20px", lineHeight: "28px", fontWeight: 600 },
  body:      { fontSize: "16px", lineHeight: "24px", fontWeight: 400 },
  caption:   { fontSize: "13px", lineHeight: "18px", fontWeight: 400 },
  specLabel: { fontSize: "12px", lineHeight: "16px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const },
} as const;

// ── Layout ────────────────────────────────────────────────────────────────────

export const LAYOUT_MAX_WIDTH       = "1200px";
export const LAYOUT_PADDING_MOBILE  = "20px";
export const LAYOUT_PADDING_DESKTOP = "64px";

// ── Borders ───────────────────────────────────────────────────────────────────

/** Everywhere: sharp, spec-plate feel */
export const BORDER_RADIUS = "2px";

/** Standard border — always 1px solid, never box-shadow */
export const BORDER_STANDARD = `1px solid ${COLOR_HAIRLINE}`;

/** Dashed border — reserved for tear-line dividers inside product cards */
export const BORDER_TEARLINE = `1px dashed ${COLOR_HAIRLINE}`;
