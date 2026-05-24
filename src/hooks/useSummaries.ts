import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteSummary,
  fetchSummaries,
  fetchSummary,
  toggleSummaryPin,
} from "../api/summaries";
import type { SummariesListResponse, SummaryFilters } from "../types";

export const summaryKeys = {
  all: ["summaries"] as const,
  list: (filters: SummaryFilters) => ["summaries", "list", filters] as const,
  detail: (id: string) => ["summaries", "detail", id] as const,
};

export function useSummaries(filters: SummaryFilters) {
  return useQuery({
    queryKey: summaryKeys.list(filters),
    queryFn: () => fetchSummaries(filters),
    placeholderData: (prev) => prev,
  });
}

export function useSummary(id: string | undefined) {
  return useQuery({
    queryKey: summaryKeys.detail(id ?? ""),
    queryFn: () => fetchSummary(id!),
    enabled: Boolean(id),
  });
}

export function useTogglePin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: toggleSummaryPin,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: summaryKeys.all });
      const previousLists = qc.getQueriesData<SummariesListResponse>({
        queryKey: summaryKeys.all,
      });

      const patchSummary = (s: { id: string; pinned: boolean }) =>
        s.id === id ? { ...s, pinned: !s.pinned } : s;

      previousLists.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData(key, {
          ...data,
          items: data.items.map(patchSummary),
        });
      });

      const detailKey = summaryKeys.detail(id);
      const prevDetail = qc.getQueryData<{ id: string; pinned: boolean }>(detailKey);
      if (prevDetail) {
        qc.setQueryData(detailKey, { ...prevDetail, pinned: !prevDetail.pinned });
      }

      return { previousLists, prevDetail, detailKey };
    },
    onError: (_err, _id, ctx) => {
      ctx?.previousLists.forEach(([key, data]) => {
        if (data) qc.setQueryData(key, data);
      });
      if (ctx?.prevDetail) qc.setQueryData(ctx.detailKey, ctx.prevDetail);
    },
    onSettled: (_data, _err, id) => {
      void qc.invalidateQueries({ queryKey: summaryKeys.all });
      void qc.invalidateQueries({ queryKey: summaryKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
}

export function useDeleteSummary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteSummary,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: summaryKeys.all });
      void qc.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
}
