import { createContext } from "react";

import type { User } from "@/api/types";
import type { LoginValues, RegisterValues } from "@/lib/validation";

export type AuthStatus = "loading" | "authenticated" | "anonymous";

export type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  login: (values: LoginValues) => Promise<User>;
  register: (values: RegisterValues) => Promise<User>;
  logout: () => void;
  /** PATCH /auth/me-ის პასუხიდან — გლობალური მომხმარებლის განახლება */
  setUser: (user: User) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
