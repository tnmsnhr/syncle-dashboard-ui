import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MockBanner } from "../components/MockBanner";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isSummaries = location.pathname.startsWith("/summaries");

  return (
    <div className="dashboard">
      <MockBanner />
      <div className="dashboard__body">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="dashboard__main-wrap">
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
            showSearch={isSummaries}
          />
          <main className="dashboard__content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
