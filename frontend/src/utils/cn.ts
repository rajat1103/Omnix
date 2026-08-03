/**
 * cn — Class Name utility
 *
 * Merges class names, filtering falsy values.
 * Lightweight alternative to clsx for this project.
 *
 * @example
 * cn("base-class", isActive && "active", undefined, "another")
 * // → "base-class active another"
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
