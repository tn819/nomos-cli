const PURPLE = "\x1b[38;5;99m";
const GREEN = "\x1b[38;5;34m";
const RED = "\x1b[38;5;1m";
const GRAY = "\x1b[38;5;246m";
const GRAY_BRIGHT = "\x1b[38;5;239m";
const MUTED = "\x1b[38;5;243m";
const RESET = "\x1b[0m";

export function getAsciiLogo(): string {
  return `
${PURPLE}   ╱       █       ╲${RESET}

${PURPLE}  ╱        █        ╲${RESET}    ${PURPLE}NOMOS${RESET} ${GRAY}CLI${RESET}

${PURPLE} ╱         █         ╲${RESET}   ${MUTED}Command-line interface${RESET}
${PURPLE}█          █          █${RESET}   ${MUTED}for the Nomos Energy API${RESET}
${PURPLE}█          █          █${RESET}   
${PURPLE}█          █          █${RESET}   ${GRAY}nomos.energy${RESET}
${PURPLE}█          █          █${RESET}   

`;
}

export function getSmallLogo(): string {
  return `${PURPLE}N${RESET} Nomos`;
}

export function getFullBanner(version: string): string {
  return `${getAsciiLogo()}
${MUTED}v${PURPLE}${version}${RESET}
`;
}

export function getWordmark(): string {
  return `${PURPLE}Nomos${RESET}`;
}

export const ansi = { PURPLE, GREEN, RED, GRAY, GRAY_BRIGHT, MUTED, RESET };
