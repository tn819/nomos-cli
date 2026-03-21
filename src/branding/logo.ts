const PURPLE = "\x1b[38;5;99m";
const GRAY = "\x1b[38;5;246m";
const MUTED = "\x1b[38;5;243m";
const RESET = "\x1b[0m";

export function getAsciiLogo(): string {
  return `
${PURPLE} ┃${RESET}   ${PURPLE}┃${RESET}    ${GRAY}NOMOS${RESET}
${PURPLE} ┃${RESET}${PURPLE}╲${RESET}  ${PURPLE}┃${RESET}  
${PURPLE} ┃${RESET} ${PURPLE}╲${RESET} ${PURPLE}┃${RESET}    ${MUTED}CLI for Nomos Energy API${RESET}
${PURPLE} ┃${RESET}  ${PURPLE}╲${RESET}${PURPLE}┃${RESET}  
${PURPLE} ┃${RESET}   ${PURPLE}╲${RESET}    ${MUTED}nomos.energy${RESET}
${RESET}
`;
}

export function getSmallLogo(): string {
  return `${PURPLE}NOMOS${RESET}`;
}

export function getFullBanner(version: string): string {
  return `${getAsciiLogo()}
${MUTED}v${PURPLE}${version}${RESET}
`;
}

export function getWordmark(): string {
  return `${PURPLE}Nomos${RESET}`;
}

export const ansi = { PURPLE, GRAY, MUTED, RESET };
