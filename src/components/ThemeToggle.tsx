import { useTheme } from "../context/ThemeContext";
import { IconMoon, IconSun } from "./NavIcons";

export function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="theme-toggle__icon" aria-hidden>
        {isDark ? <IconSun /> : <IconMoon />}
      </span>
    </button>
  );
}
