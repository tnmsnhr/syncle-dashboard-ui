import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMe, logout as logoutApi } from "../api/auth";
import { getApiErrorMessage } from "../api/client";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../utils/storage";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export function useAuth() {
  const queryClient = useQueryClient();
  const hasToken = Boolean(getAccessToken());

  const meQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchMe,
    enabled: hasToken,
    staleTime: 60_000,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({
      token,
      persist,
    }: {
      token: string;
      persist: boolean;
    }) => {
      setAccessToken(token.trim(), persist);
      return fetchMe();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await logoutApi();
      } catch {
        /* clear local session even if API is unreachable */
      }
      clearAccessToken();
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
    },
  });

  return {
    user: meQuery.data?.user,
    plan: meQuery.data?.plan,
    usage: meQuery.data?.usage,
    isLoading: hasToken && meQuery.isLoading,
    isError: meQuery.isError,
    error: meQuery.error ? getApiErrorMessage(meQuery.error) : null,
    isAuthenticated: hasToken && Boolean(meQuery.data?.user),
    refetch: meQuery.refetch,
    login: loginMutation.mutateAsync,
    loginStatus: loginMutation.status,
    loginError: loginMutation.error
      ? getApiErrorMessage(loginMutation.error)
      : null,
    logout: logoutMutation.mutateAsync,
    logoutStatus: logoutMutation.status,
  };
}
