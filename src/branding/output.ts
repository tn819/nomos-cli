/**
 * Styled output utilities for CLI
 */
import boxen from "boxen";
import Table from "cli-table3";
import { colors } from "./theme.js";

/**
 * Create a success box
 */
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

/**
 * Create an error box
 */
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

/**
 * Create an info box
 */
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

/**
 * Create a warning box
 */
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

/**
 * Create a branded table with Nomos colors
 */
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

/**
 * Format a key-value pair for display
 */
export function formatKeyValue(key: string, value: string): string {
  return `${colors.primary}${key}:${colors.reset} ${value}`;
}

/**
 * Format a section header
 */
export function formatHeader(text: string): string {
  return `\n${colors.primary}▸${colors.reset} ${colors.gray80}${text}${colors.reset}\n`;
}

/**
 * Format a list item
 */
export function formatBullet(text: string, indent = 0): string {
  const spaces = " ".repeat(indent);
  return `${spaces}${colors.gray40}•${colors.reset} ${text}`;
}