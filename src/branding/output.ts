import boxen from "boxen";
import Table from "cli-table3";
import chalk from "chalk";
import { hex } from "./theme.js";

const purple = chalk.hex(hex.primary);
const gray = chalk.hex(hex.gray40);
const muted = chalk.hex(hex.muted);
const cyan = chalk.hex("#3b82f6");
const green = chalk.hex(hex.success);
const red = chalk.hex(hex.error);

const HEX_SUCCESS = "#22c55e";
const HEX_ERROR = "#ef4444";
const HEX_INFO = "#3b82f6";
const HEX_WARNING = "#f59e0b";
const HEX_PRIMARY = "#7c5cff";

export function successBox(message: string, title?: string): string {
  return boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: HEX_SUCCESS,
    title: title || "✓ Success",
    titleAlignment: "center",
  });
}

export function errorBox(message: string, title?: string): string {
  return boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: HEX_ERROR,
    title: title || "✗ Error",
    titleAlignment: "center",
  });
}

export function infoBox(message: string, title?: string): string {
  return boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: HEX_INFO,
    title: title || "ℹ Info",
    titleAlignment: "center",
  });
}

export function warningBox(message: string, title?: string): string {
  return boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: HEX_WARNING,
    title: title || "⚠ Warning",
    titleAlignment: "center",
  });
}

export function createTable(headers: string[]): Table.Table {
  return new Table({
    head: headers.map((h) => purple(h)),
    style: {
      border: ["gray"],
      compact: true,
    },
  });
}

export function formatKeyValue(key: string, value: string): string {
  return `${purple(key)}: ${value}`;
}

export function formatHeader(text: string): string {
  return `\n${purple("▸")} ${chalk.dim(text)}\n`;
}

export function formatBullet(text: string, indent = 0): string {
  const spaces = " ".repeat(indent);
  return `${spaces}${gray("•")} ${text}`;
}

export const ansi = {
  PURPLE: purple,
  GRAY: gray,
  MUTED: muted,
  RESET: chalk.reset,
  GREEN: green,
  RED: red,
  GRAY_BRIGHT: chalk.hex(hex.gray80),
};
