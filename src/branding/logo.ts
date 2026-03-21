import chalk from "chalk";
import { hex } from "./theme.js";

const purple = chalk.hex(hex.primary);
const gray = chalk.hex(hex.gray40);
const muted = chalk.hex(hex.muted);

export function getAsciiLogo(): string {
  const line1 = purple("╱       │       ╲") + "    " + gray("NOMOS");
  const line2 = purple(" ╱       │       ╲");
  const line3 = purple("  ╱      │      ╲") + "     " + muted("CLI for Nomos Energy API");
  const line4 = purple("   ╱     │     ╲");
  const line5 = purple("    ╱    │    ╲");
  const line6 = purple("     ╱   │   ╲") + "       " + muted("nomos.energy");
  const line7 = purple("      ╱  │  ╲");
  const line8 = purple("       ╱│╲");
  
  return [line1, line2, line3, line4, line5, line6, line7, line8, ""].join("\n");
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
