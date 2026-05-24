import { apiClient } from "./client";
import type { SummariesListResponse, Summary, SummaryFilters } from "../types";

export async function fetchSummaries(
  filters: SummaryFilters = {}
): Promise<SummariesListResponse> {
  const { data } = await apiClient.get<SummariesListResponse>("/api/summaries", {
    params: {
      search: filters.search || undefined,
      status: filters.status && filters.status !== "all" ? filters.status : undefined,
      website: filters.website || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
      page: filters.page ?? 1,
      limit: filters.limit ?? 20,
    },
  });
  return data;
}

export async function fetchSummary(id: string): Promise<Summary> {
  const { data } = await apiClient.get<Summary>(`/api/summaries/${id}`);
  return data;
}

export async function toggleSummaryPin(id: string): Promise<Summary> {
  const { data } = await apiClient.post<Summary>(`/api/summaries/${id}/pin`);
  return data;
}

export async function deleteSummary(id: string): Promise<void> {
  await apiClient.delete(`/api/summaries/${id}`);
}

export async function updateSummary(
  id: string,
  patch: { title?: string; tags?: string[] }
): Promise<Summary> {
  const { data } = await apiClient.patch<Summary>(`/api/summaries/${id}`, patch);
  return data;
}
