import chalk from "chalk";
import { hex } from "./theme.js";

const purple = chalk.hex(hex.primary);
const purpleBright = chalk.hex(hex.primaryBright);
const gray = chalk.hex(hex.gray40);
const muted = chalk.hex(hex.muted);
const amber = chalk.hex(hex.warning);
const green = chalk.hex(hex.success);

// The brand name — always styled with the Nomos brand color
export const brand = purple.bold;

const ART_LINES = [
  `          ---- ---           ----       ---    ---    ------    .----    ----    ------     .-----.`,
  `        ----- .---         -----        ----   ---  ----------  -----   -----  ----------  ---------`,
  `      ----.-  .---       ----..         -.---- --- ----     --- ---.-.  --.-- --..     --- ---..  .`,
  `    ---.-.    .---     ---.-.           ----.--.-- .-.      ------..-- --.--- --.      --.---------.`,
  `  -----.      .--.   -----.             --- .--.-- .---     --.---- --.-- --. .--.     ---     .----`,
  `----.-        .--- ----.-               -.-   ----  ----------. ---  ---- ---  --------.- .---------`,
  `--.-           --- --.-                 ---    --.    .-.---.   .-.  --.  ---    ------     -----..`,
];

export function getAsciiLogo(): string {
  const art = purple(ART_LINES.join("\n"));
  const subtitle = [
    `  `,
    amber(`⚡`),
    `  `,
    muted(`CLI for`),
    ` `,
    brand(`Nomos`),
    ` `,
    muted(`Energy API`),
    `  `,
    muted(`·`),
    `  `,
    purpleBright(`nomos.energy`),
  ].join("");
  return `\n${art}\n${subtitle}\n`;
}

export function getWelcomeTips(): string {
  // Pad on plain text before coloring to avoid ANSI length miscounts
  const tip = (label: string, desc: string) =>
    `  ${green("›")} ${purple.bold(label.padEnd(26))}${muted(desc)}`;

  return [
    ``,
    `  ${purple("╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌")}`,
    tip(`nomos login`,            `save credentials for future calls`),
    tip(`nomos capabilities`,     `browse all available API endpoints`),
    tip(`nomos call <operation>`, `call any endpoint by operation key`),
    tip(`nomos operations`,       `list all operation keys`),
    `  ${purple("╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌")}`,
    ``,
  ].join("\n");
}

export function getSmallLogo(): string {
  return brand("NOMOS");
}

export function getFullBanner(version: string): string {
  return getAsciiLogo() + "\n" + muted("v") + purple(version) + "\n";
}

export function getWordmark(): string {
  return brand("Nomos");
}

export const ansi = {
  PURPLE: `\x1b[38;5;99m`,
  GRAY: `\x1b[38;5;246m`,
  MUTED: `\x1b[38;5;243m`,
  RESET: `\x1b[0m`,
  GREEN: `\x1b[38;5;34m`,
  RED: `\x1b[38;5;1m`,
  GRAY_BRIGHT: `\x1b[38;5;239m`,
  AMBER: `\x1b[38;5;214m`,
  BRIGHT: `\x1b[38;5;105m`,
};
