import chalk from "chalk";
import { hex } from "./theme.js";

const purple = chalk.hex(hex.primary);
const gray = chalk.hex(hex.gray40);
const muted = chalk.hex(hex.muted);

export function getAsciiLogo(): string {
  const nSymbol = purple("/|/");
  const wordmark = gray("NOMOS");
  const subtitle = muted("CLI for Nomos Energy API · nomos.energy");
  
  return `${nSymbol} ${wordmark}\n  ${subtitle}\n`;
}

export function getSmallLogo(): string {
  return purple("NOMOS");
}

export function getFullBanner(version: string): string {
  return getAsciiLogo() + "\n" + muted("v") + purple(version) + "\n";
}

export function getWordmark(): string {
  return purple("Nomos");
}

export const ansi = {
  PURPLE: `\x1b[38;5;99m`,
  GRAY: `\x1b[38;5;246m`,
  MUTED: `\x1b[38;5;243m`,
  RESET: `\x1b[0m`,
  GREEN: `\x1b[38;5;34m`,
  RED: `\x1b[38;5;1m`,
  GRAY_BRIGHT: `\x1b[38;5;239m`,
};
