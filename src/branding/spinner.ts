/**
 * Spinner utilities using ora
 */
import ora, { type Ora } from "ora";

/**
 * Create a spinner with Nomos branding
 */
export function createSpinner(text: string): Ora {
  return ora({
    text,
    color: "magenta",
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