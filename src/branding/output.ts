import boxen from "boxen";
import Table from "cli-table3";
import { ansi } from "./logo.js";

export function successBox(message: string, title?: string): string {
  return boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "green",
    title: title || "✓ Success",
    titleAlignment: "center",
  });
}

export function errorBox(message: string, title?: string): string {
  return boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "red",
    title: title || "✗ Error",
    titleAlignment: "center",
  });
}

export function infoBox(message: string, title?: string): string {
  return boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "blue",
    title: title || "ℹ Info",
    titleAlignment: "center",
  });
}

export function warningBox(message: string, title?: string): string {
  return boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "yellow",
    title: title || "⚠ Warning",
    titleAlignment: "center",
  });
}

export function createTable(headers: string[]): Table.Table {
  return new Table({
    head: headers,
    style: {
      head: ["magenta"],
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
