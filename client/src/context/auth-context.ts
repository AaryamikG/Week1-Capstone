import { createContext } from "react";
import type { Credentials } from "../api/auth";
import type { User } from "../types";

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  signup: (credentials: Credentials) => Promise<void>;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
