/**
 * Spinner utilities using ora
 */
import ora, { type Ora } from "ora";
import { hex } from "./theme.js";

/**
 * Create a spinner with Nomos branding
 */
export function createSpinner(text: string): Ora {
  return ora({
    text,
    color: hex.primary as unknown as "magenta",
    spinner: "dots",
  });
}

/**
 * Create a processing spinner
 */
export function processingSpinner(text = "Processing..."): Ora {
  const spinner = createSpinner(text);
  spinner.start();
  return spinner;
}

/**
 * Create a loading spinner
 */
export function loadingSpinner(text = "Loading..."): Ora {
  const spinner = createSpinner(text);
  spinner.start();
  return spinner;
}