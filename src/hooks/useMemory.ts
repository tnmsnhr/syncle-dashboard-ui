import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMemoryItem,
  deleteMemoryItem,
  fetchMemory,
  setMemoryEnabled,
  updateMemoryItem,
} from "../api/memory";
import type { MemoryCategory } from "../types";

export const memoryKeys = {
  all: ["memory"] as const,
};

export function useMemory() {
  return useQuery({
    queryKey: memoryKeys.all,
    queryFn: fetchMemory,
  });
}

export function useCreateMemory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { key: string; value: string; category?: MemoryCategory }) =>
      createMemoryItem(body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: memoryKeys.all }),
  });
}

export function useUpdateMemory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<{ key: string; value: string; category: MemoryCategory }>;
    }) => updateMemoryItem(id, patch),
    onSuccess: () => void qc.invalidateQueries({ queryKey: memoryKeys.all }),
  });
}

export function useDeleteMemory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteMemoryItem,
    onSuccess: () => void qc.invalidateQueries({ queryKey: memoryKeys.all }),
  });
}

export function useToggleMemoryEnabled() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: setMemoryEnabled,
    onSuccess: (data) => qc.setQueryData(memoryKeys.all, data),
  });
}
