/**
 * Nomos ASCII Logo
 * Geometric N symbol inspired by symbol.svg
 */

import { colors } from "./theme.js";

/**
 * Returns the full ASCII Nomos N logo
 */
export function getAsciiLogo(): string {
  const n = colors.primary;
  const r = colors.reset;
  
  return `
${n}███╗   ███╗${r} ██████╗  ██████╗ ██████╗  ██████╗
${n}████╗ ████║${r} ██╔════╝ ██╔════╝██╔═══██╗██╔════╝
${n}██╔████╔██║${r} ██║      ██║     ██║   ██║██║     
${n}██║╚██╔╝██║${r} ██║██║     ██║   ██║██║     
${n}██║ ╚═╝ ██║${r} ╚██████╗╚██████╗╚██████╔╝╚██████╗
${n}╚═╝     ╚═╝${r}  ╚══════╝ ╚══════╝ ╚═════╝  ╚══════╝

${n}Nomos SDK + CLI${r}
`;
}

/**
 * Returns a small logo for inline use
 */
export function getSmallLogo(): string {
  const n = colors.primary;
  const r = colors.reset;
  return `${n}▟▙${r} Nomos`;
}

/**
 * Returns the logo with version
 */
export function getFullBanner(version: string): string {
  return `${getAsciiLogo()}
${colors.muted}Version: ${colors.primary}${version}${colors.reset}
`;
}

/**
 * Returns just the wordmark
 */
export function getWordmark(): string {
  const n = colors.primary;
  const r = colors.reset;
  return `${n}Nomos${r}`;
}