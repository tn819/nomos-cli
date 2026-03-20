import chalk from "chalk";

export const hex = {
  primary: "#7c5cff",
  primaryBright: "#9d7fff",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
  muted: "#71717a",
  gray40: "#a1a1aa",
  gray80: "#27272a",
} as const;

export const c = {
  primary: chalk.hex(hex.primary),
  primaryBright: chalk.hex(hex.primaryBright),
  success: chalk.hex(hex.success),
  warning: chalk.hex(hex.warning),
  error: chalk.hex(hex.error),
  info: chalk.hex(hex.info),
  muted: chalk.hex(hex.muted),
  gray: chalk.hex(hex.gray40),
  grayBright: chalk.hex(hex.gray80),
  reset: chalk.reset,
  bold: chalk.bold,
  dim: chalk.dim,
};

export const primary = c.primary;
export const success = c.success;
export const warning = c.warning;
export const error = c.error;
export const info = c.info;
export const muted = c.muted;
