import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ThemePreference, ResolvedTheme } from "../utils/theme";
import {
  applyThemePreference,
  getThemePreference,
  resolveTheme,
  setThemePreference,
  toggleThemePreference,
} from "../utils/theme";

interface ThemeContextValue {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(getThemePreference);
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    resolveTheme(getThemePreference())
  );

  useEffect(() => {
    setResolved(applyThemePreference(preference));
  }, [preference]);

  useEffect(() => {
    if (preference !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(applyThemePreference("system"));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    setResolved(setThemePreference(next));
  }, []);

  const toggle = useCallback(() => {
    const nextResolved = toggleThemePreference();
    setPreferenceState(getThemePreference());
    setResolved(nextResolved);
  }, []);

  const value = useMemo(
    () => ({ preference, resolved, setPreference, toggle }),
    [preference, resolved, setPreference, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
