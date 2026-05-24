import { apiClient } from "./client";
import type { SyncStatus } from "../types";

export async function fetchSyncStatus(): Promise<SyncStatus> {
  const { data } = await apiClient.get<SyncStatus>("/api/sync/status");
  return data;
}

export async function triggerManualSync(): Promise<SyncStatus> {
  const { data } = await apiClient.post<SyncStatus>("/api/sync/manual");
  return data;
}
