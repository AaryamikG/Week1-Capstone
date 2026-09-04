import { useReducer, useCallback, useMemo, type ReactNode } from "react";
import * as authApi from "../api/auth";
import type { Credentials } from "../api/auth";
import { TOKEN_STORAGE_KEY } from "../api/client";
import { getUserFromToken } from "../utils/jwt";
import type { User } from "../types";
import { AuthContext } from "./auth-context";

interface AuthState {
  user: User | null;
  token: string | null;
}

type AuthAction =
  | { type: "AUTH_SUCCESS"; token: string; user: User }
  | { type: "LOGOUT" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_SUCCESS":
      return { user: action.user, token: action.token };
    case "LOGOUT":
      return { user: null, token: null };
    default:
      return state;
  }
}

function initAuthState(): AuthState {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) return { user: null, token: null };
  const user = getUserFromToken(token);
  if (!user) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return { user: null, token: null };
  }
  return { user, token };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, undefined, initAuthState);

  const applyToken = useCallback((token: string) => {
    const user = getUserFromToken(token);
    if (!user) {
      throw new Error("Received an invalid session token.");
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    dispatch({ type: "AUTH_SUCCESS", token, user });
  }, []);

  const signup = useCallback(
    async (credentials: Credentials) => {
      const { token } = await authApi.signup(credentials);
      applyToken(token);
    },
    [applyToken],
  );

  const login = useCallback(
    async (credentials: Credentials) => {
      const { token } = await authApi.login(credentials);
      applyToken(token);
    },
    [applyToken],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    dispatch({ type: "LOGOUT" });
  }, []);

  const value = useMemo(
    () => ({ ...state, signup, login, logout }),
    [state, signup, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
