import { api } from "./client";
import type { AuthResponse, User } from "./types";

export const authApi = {
  login: (body: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", body, { handleUnauthorized: false }),

  register: (body: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>("/auth/register", body, { handleUnauthorized: false }),

  forgotPassword: (body: { email: string }) =>
    api.post<{ message?: string }>("/auth/forgot-password", body, { handleUnauthorized: false }),

  me: (signal?: AbortSignal) => api.get<{ user: User }>("/auth/me", signal),

  updateMe: (body: {
    currentPassword: string;
    name?: string;
    email?: string;
    newPassword?: string;
  }) => api.patch<{ user: User }>("/auth/me", body),
};
