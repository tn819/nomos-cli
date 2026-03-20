/**
 * Nomos Brand Colors
 * Extracted from monorepo design system
 * Primary: oklch(50.07% 0.281 270.84) → #7c5cff (purple/blue)
 */

export const colors = {
  // Brand primary - Nomos purple/blue
  primary: "#7c5cff",
  primaryBright: "#9d7fff",
  primaryDim: "#5a3fd6",
  
  // Semantic colors
  success: "#22c55e",
  successBright: "#4ade80",
  warning: "#f59e0b",
  warningBright: "#fbbf24",
  error: "#ef4444",
  errorBright: "#f87171",
  info: "#3b82f6",
  infoBright: "#60a5fa",
  
  // Grayscale (from nomos-gray scale)
  gray5: "#fcfcfc",
  gray10: "#f4f4f5",
  gray20: "#e4e4e7",
  gray30: "#d4d4d8",
  gray40: "#a1a1aa",
  gray50: "#71717a",
  gray60: "#52525b",
  gray70: "#3f3f46",
  gray80: "#27272a",
  gray90: "#18181b",
  gray100: "#09090b",
  
  // Semantic aliases
  muted: "#71717a",
  reset: "\x1b[0m",
} as const;

// Hex colors for chalk
export const hexColors = {
  primary: colors.primary,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  info: colors.info,
} as const;

// Convenient exports
export const primary = colors.primary;
export const success = colors.success;
export const warning = colors.warning;
export const error = colors.error;
export const info = colors.info;
export const muted = colors.muted;