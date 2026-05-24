import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSyncStatus, triggerManualSync } from "../api/sync";

export const syncKeys = {
  status: ["sync", "status"] as const,
};

export function useSyncStatus() {
  return useQuery({
    queryKey: syncKeys.status,
    queryFn: fetchSyncStatus,
  });
}

export function useManualSync() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: triggerManualSync,
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: syncKeys.status });
      const prev = qc.getQueryData(syncKeys.status);
      qc.setQueryData(syncKeys.status, {
        ...(prev as object),
        status: "syncing",
      });
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(syncKeys.status, ctx.prev);
    },
    onSuccess: (data) => qc.setQueryData(syncKeys.status, data),
    onSettled: () => void qc.invalidateQueries({ queryKey: syncKeys.status }),
  });
}
