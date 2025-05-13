
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalize a string for case-insensitive comparison by:
 * - Converting to lowercase
 * - Trimming whitespace
 */
export function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}
