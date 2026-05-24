import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Logo } from "./Logo";
import {
  IconMemory,
  IconOverview,
  IconSettings,
  IconSummaries,
  IconSync,
} from "./NavIcons";

const navItems = [
  { to: "/", label: "Overview", end: true, Icon: IconOverview },
  { to: "/summaries", label: "Summaries", end: false, Icon: IconSummaries },
  { to: "/memory", label: "Memory", end: false, Icon: IconMemory },
  { to: "/sync", label: "Sync", end: false, Icon: IconSync },
  { to: "/settings", label: "Settings", end: false, Icon: IconSettings },
] as const;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={clsx("sidebar-overlay", open && "sidebar-overlay--visible")}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={clsx("sidebar", open && "sidebar--open")}
        aria-label="Main navigation"
      >
        <div className="sidebar__brand">
          <Logo />
        </div>

        <p className="sidebar__section-label">Overview</p>
        <nav className="sidebar__nav">
          {navItems.map(({ to, label, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                clsx("sidebar__link", isActive && "sidebar__link--active")
              }
            >
              <Icon className="sidebar__icon" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
