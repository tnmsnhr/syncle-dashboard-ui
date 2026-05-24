import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import LoginPage from "./pages/LoginPage";
import MemoryPage from "./pages/MemoryPage";
import OverviewPage from "./pages/OverviewPage";
import SettingsPage from "./pages/SettingsPage";
import SummariesPage from "./pages/SummariesPage";
import SummaryDetailPage from "./pages/SummaryDetailPage";
import SyncPage from "./pages/SyncPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/callback" element={<AuthCallbackPage />} />
        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="summaries" element={<SummariesPage />} />
          <Route path="summaries/:id" element={<SummaryDetailPage />} />
          <Route path="memory" element={<MemoryPage />} />
          <Route path="sync" element={<SyncPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
