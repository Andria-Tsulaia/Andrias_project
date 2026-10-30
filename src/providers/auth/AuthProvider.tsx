import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/api/auth";
import { ApiError, configureApiAuth } from "@/api/client";
import type { User } from "@/api/types";
import { AuthContext, type AuthContextValue, type AuthStatus } from "./auth-context";
import { getStoredToken, setStoredToken } from "./token-storage";

const unauthorizedRef: { current: (() => void) | null } = { current: null };

// კლიენტი ინიციალიზდება პირველივე მოთხოვნამდე — ტოკენი იკითხება storage-იდან
configureApiAuth(getStoredToken, () => unauthorizedRef.current?.());

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(getStoredToken() ? "loading" : "anonymous");
  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
    setStatus("anonymous");
    // სხვა მომხმარებლის კალათა/შეკვეთები/პროფილი ფრონტზე არ უნდა დარჩეს
    queryClient.removeQueries({ queryKey: ["cart"] });
    queryClient.removeQueries({ queryKey: ["checkout"] });
    queryClient.removeQueries({ queryKey: ["addresses"] });
    queryClient.removeQueries({ queryKey: ["orders"] });
    queryClient.removeQueries({ queryKey: ["order"] });
    queryClient.removeQueries({ queryKey: ["me"] });
  }, [queryClient]);

  unauthorizedRef.current = logout;

  useEffect(() => {
    if (!getStoredToken()) {
      setStatus("anonymous");
      return;
    }

    let active = true;
    const controller = new AbortController();

    authApi
      .me(controller.signal)
      .then(({ user: me }) => {
        if (!active) return;
        setUser(me);
        setStatus("authenticated");
      })
      .catch((error) => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 401) logout();
        else setStatus("anonymous");
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [logout]);

  const login = useCallback(
    async (values: { email: string; password: string }) => {
      const { user: nextUser, accessToken } = await authApi.login(values);
      setStoredToken(accessToken);
      setUser(nextUser);
      setStatus("authenticated");
      queryClient.removeQueries({ queryKey: ["cart"] });
      return nextUser;
    },
    [queryClient],
  );

  const register = useCallback(
    async (values: { name: string; email: string; password: string; confirmPassword: string }) => {
      const { user: nextUser, accessToken } = await authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      setStoredToken(accessToken);
      setUser(nextUser);
      setStatus("authenticated");
      return nextUser;
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout, setUser }),
    [user, status, login, register, logout, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
