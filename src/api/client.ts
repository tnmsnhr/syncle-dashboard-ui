import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken } from "../utils/storage";

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<{ error?: string; message?: string }>;
    if (ax.response?.status === 401) {
      return "Session expired — please sign in again.";
    }
    return ax.response?.data?.error ?? ax.response?.data?.message ?? ax.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

let usingMockFallback = false;
export function isUsingMockFallback(): boolean {
  return usingMockFallback;
}
export function setUsingMockFallback(value: boolean): void {
  usingMockFallback = value;
}
