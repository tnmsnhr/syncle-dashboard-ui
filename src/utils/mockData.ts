/**
 * Fallback data when the API is unreachable (offline / server down).
 */
import type {
  DashboardStats,
  MemoryState,
  SummariesListResponse,
  Summary,
  SyncStatus,
  MeResponse,
} from "../types";

const now = Date.now();

export const mockMe: MeResponse = {
  user: { sub: "mock", email: "demo@syncle.app", name: "Demo User" },
  plan: "free",
  usage: { summariesThisMonth: 3, limit: 500 },
};

export const mockSummaries: Summary[] = [
  {
    id: "mock-1",
    title: "React Server Components overview",
    originalText: "Server Components run on the server...",
    summaryText: "RSC reduces client bundle size by fetching on the server.",
    sourceUrl: "https://react.dev",
    website: "react.dev",
    tags: ["react"],
    pinned: true,
    followUps: [],
    createdAt: new Date(now - 86400000).toISOString(),
    updatedAt: new Date(now - 86400000).toISOString(),
  },
];

export const mockSummariesList: SummariesListResponse = {
  items: mockSummaries,
  pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
};

export const mockStats: DashboardStats = {
  totalSummaries: 3,
  pinnedCount: 2,
  websitesThisWeek: 2,
  usagePercent: 12,
  recentActivity: [
    {
      id: "mock-1",
      title: "React Server Components overview",
      action: "pinned",
      at: new Date(now - 3600000).toISOString(),
    },
  ],
  quickStats: { avgSummariesPerDay: 1, lastSummaryAt: new Date(now - 3600000).toISOString() },
};

export const mockMemory: MemoryState = {
  enabled: true,
  items: [
    {
      id: "m1",
      key: "role",
      value: "I am a frontend engineer",
      category: "profile",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

export const mockSync: SyncStatus = {
  status: "error",
  lastSyncedAt: null,
  message: "Backend unavailable — showing offline state",
  devices: [],
};

export function isNetworkError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { code?: string; message?: string };
  return e.code === "ERR_NETWORK" || e.message === "Network Error";
}
