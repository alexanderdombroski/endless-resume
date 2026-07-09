/**
 * Utility functions for string manipulation and punctuation checks.
 */

/**
 * Checks if a trimmed string ends with a period.
 */
export function hasEndingPeriod(str: string): boolean {
  if (typeof str !== "string") return false;
  return str.trim().endsWith(".");
}

/**
 * Checks if a trimmed string starts with a period.
 */
export function hasStartingPeriod(str: string): boolean {
  if (typeof str !== "string") return false;
  return str.trim().startsWith(".");
}

/**
 * Adds a period to the end of a string if it doesn't already end with one.
 */
export function addEndingPeriod(str: string): string {
  if (typeof str !== "string") return str;
  const trimmed = str.trim();
  if (trimmed === "") return str;
  if (!trimmed.endsWith(".")) {
    return str + ".";
  }
  return str;
}

/**
 * Removes a period from the end of a string if it ends with one.
 */
export function removeEndingPeriod(str: string): string {
  if (typeof str !== "string") return str;
  const trimmed = str.trim();
  if (trimmed.endsWith(".")) {
    const idx = str.lastIndexOf(".");
    if (idx !== -1) {
      return str.slice(0, idx) + str.slice(idx + 1);
    }
  }
  return str;
}

/**
 * Adds a period to the start of a string if it doesn't already start with one.
 */
export function addStartingPeriod(str: string): string {
  if (typeof str !== "string") return str;
  const trimmed = str.trim();
  if (trimmed === "") return str;
  if (!trimmed.startsWith(".")) {
    return "." + str;
  }
  return str;
}

/**
 * Removes a period from the start of a string if it starts with one.
 */
export function removeStartingPeriod(str: string): string {
  if (typeof str !== "string") return str;
  const trimmed = str.trim();
  if (trimmed.startsWith(".")) {
    const idx = str.indexOf(".");
    if (idx !== -1) {
      return str.slice(0, idx) + str.slice(idx + 1);
    }
  }
  return str;
}
