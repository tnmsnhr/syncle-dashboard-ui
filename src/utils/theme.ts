import type { UserSettings } from "../types";
import { getStoredSettings, saveStoredSettings } from "./storage";

export type ThemePreference = UserSettings["theme"];
export type ResolvedTheme = "light" | "dark";

const DEFAULT_SETTINGS: Pick<UserSettings, "theme"> = { theme: "system" };

export function getThemePreference(): ThemePreference {
  return getStoredSettings(DEFAULT_SETTINGS).theme;
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === "dark") return "dark";
  if (preference === "light") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyResolvedTheme(resolved: ResolvedTheme): void {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function applyThemePreference(preference: ThemePreference): ResolvedTheme {
  const resolved = resolveTheme(preference);
  applyResolvedTheme(resolved);
  return resolved;
}

export function setThemePreference(preference: ThemePreference): ResolvedTheme {
  const current = getStoredSettings<UserSettings>({
    theme: "system",
    extension: {
      autoPin: false,
      showSourceInPopup: true,
      compactPopup: false,
    },
  });
  saveStoredSettings({ ...current, theme: preference });
  return applyThemePreference(preference);
}

export function toggleThemePreference(): ResolvedTheme {
  const resolved = resolveTheme(getThemePreference());
  const next: ThemePreference = resolved === "dark" ? "light" : "dark";
  return setThemePreference(next);
}

/** Call before React mounts to avoid flash of wrong theme. */
export function initTheme(): ResolvedTheme {
  return applyThemePreference(getThemePreference());
}
