import type { InputHTMLAttributes } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../hooks/useAuth";
import type { UserSettings } from "../types";
import { getStoredSettings, saveStoredSettings } from "../utils/storage";
import { formatDate } from "../utils/format";

const defaultSettings: UserSettings = {
  theme: "system",
  extension: {
    autoPin: false,
    showSourceInPopup: true,
    compactPopup: false,
  },
};

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, plan, usage, isAuthenticated, logout, logoutStatus } = useAuth();
  const { preference, setPreference } = useTheme();

  const { register, handleSubmit, watch, reset, setValue } = useForm<UserSettings>({
    defaultValues: getStoredSettings(defaultSettings),
  });

  useEffect(() => {
    reset(getStoredSettings(defaultSettings));
  }, [reset]);

  useEffect(() => {
    setValue("theme", preference);
  }, [preference, setValue]);

  const theme = watch("theme");

  useEffect(() => {
    if (theme && theme !== preference) {
      setPreference(theme);
    }
  }, [theme, preference, setPreference]);

  const onSave = handleSubmit((values) => {
    saveStoredSettings(values);
    setPreference(values.theme);
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="page-stack page-stack--narrow">
      <header className="page-header">
        <h1 className="h1">Settings</h1>
        <p className="page-header__desc">Account, appearance, and extension preferences.</p>
      </header>

      <section className="card">
        <h2 className="h3" style={{ marginBottom: "1rem" }}>
          Profile
        </h2>
        <dl className="profile-dl">
          <div>
            <dt>Name</dt>
            <dd>{user?.name ?? "—"}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user?.email ?? "—"}</dd>
          </div>
          <div>
            <dt>Plan</dt>
            <dd style={{ textTransform: "capitalize" }}>{plan ?? "free"}</dd>
          </div>
          <div>
            <dt>Usage this month</dt>
            <dd>
              {usage
                ? `${usage.summariesThisMonth} / ${usage.limit} summaries`
                : "—"}
            </dd>
          </div>
        </dl>
      </section>

      <form onSubmit={onSave} className="card page-stack">
        <div>
          <h2 className="h3" style={{ marginBottom: "0.75rem" }}>
            Appearance
          </h2>
          <label className="field">
            <span className="field__label">Theme</span>
            <select {...register("theme")} className="select">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>

        <div>
          <h2 className="h3" style={{ marginBottom: "0.75rem" }}>
            Extension preferences
          </h2>
          <div className="page-stack" style={{ gap: "0.75rem" }}>
            <CheckboxField
              label="Auto-pin new summaries"
              {...register("extension.autoPin")}
            />
            <CheckboxField
              label="Show source URL in popup"
              {...register("extension.showSourceInPopup")}
            />
            <CheckboxField
              label="Compact popup layout"
              {...register("extension.compactPopup")}
            />
          </div>
        </div>

        <button type="submit" className="btn btn--primary">
          Save preferences
        </button>
      </form>

      <section className="card">
        <h2 className="h3" style={{ marginBottom: "0.5rem" }}>
          Session
        </h2>
        <p className="text-muted" style={{ marginBottom: "1rem" }}>
          {isAuthenticated
            ? `Signed in with Google${user?.email ? ` as ${user.email}` : ""}.`
            : "Sign in with Google to view your summaries."}
        </p>
        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutStatus === "pending"}
            className="btn btn--danger"
          >
            {logoutStatus === "pending" ? "Signing out…" : "Sign out"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="btn btn--primary"
          >
            Sign in
          </button>
        )}
      </section>

      <p className="text-xs" style={{ textAlign: "center" }}>
        Syncle Dashboard · {formatDate(new Date().toISOString())}
      </p>
    </div>
  );
}

function CheckboxField({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="checkbox-field">
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
}

export default SettingsPage;
