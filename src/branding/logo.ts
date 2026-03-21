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
  PURPLE: purple, 
  GRAY: gray, 
  MUTED: muted, 
  RESET: chalk.reset,
  GREEN: chalk.hex(hex.success),
  RED: chalk.hex(hex.error),
  GRAY_BRIGHT: chalk.hex(hex.gray80)
};
