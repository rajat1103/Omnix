import { useEffect, useCallback } from "react";

interface KeyboardShortcutOptions {
  /** Whether to prevent the default browser behavior */
  preventDefault?: boolean;
  /** Only trigger when this element is focused (default: document) */
  targetElement?: HTMLElement | null;
  /** Whether the shortcut is currently active */
  enabled?: boolean;
}

/**
 * useKeyboardShortcut — Register a global keyboard shortcut
 *
 * @param keys  Modifier + key combination, e.g. "ctrl+k", "meta+k", "escape"
 * @param callback  Function to call when the shortcut is triggered
 * @param options  Configuration options
 *
 * @example
 * useKeyboardShortcut("ctrl+k", () => openCommandPalette(), { preventDefault: true });
 */
export function useKeyboardShortcut(
  keys: string,
  callback: (event: KeyboardEvent) => void,
  options: KeyboardShortcutOptions = {}
): void {
  const { preventDefault = true, targetElement = null, enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const parts = keys.toLowerCase().split("+");
      const key = parts[parts.length - 1];
      const modifiers = parts.slice(0, -1);

      const ctrlRequired = modifiers.includes("ctrl");
      const metaRequired = modifiers.includes("meta");
      const shiftRequired = modifiers.includes("shift");
      const altRequired = modifiers.includes("alt");

      const ctrlOrMeta = ctrlRequired
        ? event.ctrlKey
        : metaRequired
          ? event.metaKey
          : true;

      const shiftMatch = shiftRequired ? event.shiftKey : !event.shiftKey || !shiftRequired;
      const altMatch = altRequired ? event.altKey : true;

      const keyMatch = event.key.toLowerCase() === key;

      // For ctrl+k / meta+k, accept either modifier (cross-platform)
      const modifierMatch =
        (ctrlRequired || metaRequired
          ? event.ctrlKey || event.metaKey
          : ctrlOrMeta) &&
        shiftMatch &&
        altMatch;

      if (keyMatch && modifierMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    },
    [keys, callback, preventDefault, enabled]
  );

  useEffect(() => {
    const element = targetElement ?? document;
    element.addEventListener("keydown", handleKeyDown as EventListener);
    return () => {
      element.removeEventListener("keydown", handleKeyDown as EventListener);
    };
  }, [handleKeyDown, targetElement]);
}
