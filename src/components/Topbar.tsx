import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getInitials } from "../utils/greeting";
import { IconMenu, IconSearch } from "./NavIcons";
import { ThemeToggle } from "./ThemeToggle";

interface TopbarProps {
  onMenuClick: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
}

export function Topbar({
  onMenuClick,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search summaries…",
  showSearch = true,
}: TopbarProps) {
  const navigate = useNavigate();
  const { user, plan, isAuthenticated, logout, logoutStatus } = useAuth();
  const initials = getInitials(user?.name, user?.email);

  return (
    <header className="topbar">
      <button
        type="button"
        className="btn btn--icon topbar__menu"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <IconMenu />
      </button>

      {showSearch && onSearchChange && (
        <div className="topbar__search">
          <div className="search-field">
            <IconSearch className="search-field__icon" />
            <input
              type="search"
              className="search-field__input"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search"
            />
          </div>
        </div>
      )}

      <div className="topbar__actions">
        <ThemeToggle />

        {user && (
          <div className="topbar__user">
            <p className="topbar__name">{user.name ?? user.email ?? "User"}</p>
            <p className="topbar__plan">{plan ?? "free"} plan</p>
          </div>
        )}

        <button
          type="button"
          className="topbar__avatar"
          onClick={() => navigate("/settings")}
          aria-label="Account settings"
        >
          {initials}
        </button>

        {isAuthenticated && (
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => void logout()}
            disabled={logoutStatus === "pending"}
          >
            {logoutStatus === "pending" ? "…" : "Sign out"}
          </button>
        )}
      </div>
    </header>
  );
}
