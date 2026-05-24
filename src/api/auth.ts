import { apiClient } from "./client";
import type { MeResponse } from "../types";
import { getServicesBaseUrl } from "../utils/apiBase";

export async function fetchMe(): Promise<MeResponse> {
  const { data } = await apiClient.get<MeResponse>("/api/me");
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/api/logout");
}

export async function fetchAuthStatus(): Promise<{
  googleSignIn: boolean;
  browserOAuth: boolean;
}> {
  const base = getServicesBaseUrl();
  const res = await fetch(`${base}/auth/status`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Auth status failed (${res.status})`);
  }
  return res.json() as Promise<{ googleSignIn: boolean; browserOAuth: boolean }>;
}
