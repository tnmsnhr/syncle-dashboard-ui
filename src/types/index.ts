export interface User {
  sub: string;
  email?: string;
  name?: string;
}

export interface MeResponse {
  user: User;
  plan: string;
  usage?: {
    summariesThisMonth: number;
    limit: number;
  };
}

export interface ActivityItem {
  id: string;
  title: string;
  action: string;
  at: string;
}

export interface DashboardStats {
  totalSummaries: number;
  pinnedCount: number;
  websitesThisWeek: number;
  summariesThisMonth?: number;
  usagePercent?: number;
  recentActivity: ActivityItem[];
  quickStats?: {
    avgSummariesPerDay: number;
    lastSummaryAt: string | null;
  };
}

export interface FollowUpMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface Summary {
  id: string;
  title: string;
  originalText: string;
  summaryText: string;
  sourceUrl: string;
  website: string;
  tags: string[];
  pinned: boolean;
  followUps: FollowUpMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SummariesListResponse {
  items: Summary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SummaryFilters {
  search?: string;
  status?: "pinned" | "unpinned" | "all";
  website?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export type MemoryCategory = "profile" | "preference" | "domain";

export interface MemoryItem {
  id: string;
  key: string;
  value: string;
  category: MemoryCategory;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryState {
  enabled: boolean;
  items: MemoryItem[];
}

export interface SyncDevice {
  id: string;
  name: string;
  platform: string;
  lastSeenAt: string;
}

export interface SyncStatus {
  status: "synced" | "syncing" | "error" | "conflict";
  lastSyncedAt: string | null;
  message?: string;
  devices: SyncDevice[];
}

export interface ExtensionPreferences {
  autoPin: boolean;
  showSourceInPopup: boolean;
  compactPopup: boolean;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  extension: ExtensionPreferences;
}
