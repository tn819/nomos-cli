import boxen from "boxen";
import Table from "cli-table3";
import { ansi } from "./logo.js";

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
    head: headers.map((h) => `${ansi.PURPLE}${h}${ansi.RESET}`),
    style: {
      border: ["gray"],
      compact: true,
    },
  });
}

export function formatKeyValue(key: string, value: string): string {
  return `${ansi.PURPLE}${key}:${ansi.RESET} ${value}`;
}

export function formatHeader(text: string): string {
  return `\n${ansi.PURPLE}▸${ansi.RESET} ${ansi.GRAY_BRIGHT}${text}${ansi.RESET}\n`;
}

export function formatBullet(text: string, indent = 0): string {
  const spaces = " ".repeat(indent);
  return `${spaces}${ansi.GRAY}•${ansi.RESET} ${text}`;
}
