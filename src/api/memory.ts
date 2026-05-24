import { apiClient } from "./client";
import type { MemoryItem, MemoryState, MemoryCategory } from "../types";

export async function fetchMemory(): Promise<MemoryState> {
  const { data } = await apiClient.get<MemoryState>("/api/memory");
  return data;
}

export async function createMemoryItem(body: {
  key: string;
  value: string;
  category?: MemoryCategory;
}): Promise<MemoryItem> {
  const { data } = await apiClient.post<MemoryItem>("/api/memory", body);
  return data;
}

export async function updateMemoryItem(
  id: string,
  patch: Partial<{ key: string; value: string; category: MemoryCategory }>
): Promise<MemoryItem> {
  const { data } = await apiClient.patch<MemoryItem>(`/api/memory/${id}`, patch);
  return data;
}

export async function deleteMemoryItem(id: string): Promise<void> {
  await apiClient.delete(`/api/memory/${id}`);
}

export async function setMemoryEnabled(enabled: boolean): Promise<MemoryState> {
  const { data } = await apiClient.patch<MemoryState>("/api/memory", { enabled });
  return data;
}
