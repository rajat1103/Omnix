import { useState, useEffect, useCallback } from "react";

/**
 * useLocalStorage — Typed localStorage hook with React state sync
 *
 * Reads the initial value from localStorage, falls back to `defaultValue`,
 * and keeps both the stored value and React state in sync.
 *
 * @param key  localStorage key
 * @param defaultValue  Fallback if key doesn't exist
 *
 * @example
 * const [name, setName] = useLocalStorage("user-name", "");
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      console.warn(`[useLocalStorage] Failed to read key "${key}"`);
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          typeof value === "function"
            ? (value as (prev: T) => T)(storedValue)
            : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch {
        console.warn(`[useLocalStorage] Failed to write key "${key}"`);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      window.localStorage.removeItem(key);
    } catch {
      console.warn(`[useLocalStorage] Failed to remove key "${key}"`);
    }
  }, [key, defaultValue]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T);
        } catch {
          // ignore parse errors from other tabs
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key]);

  return [storedValue, setValue, removeValue];
}
