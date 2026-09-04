import api from "./client";
import type { AuthResponse } from "../types";

export interface Credentials {
  email: string;
  password: string;
}

export async function signup(credentials: Credentials): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/api/users/signup", credentials);
  return res.data;
}

export async function login(credentials: Credentials): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/api/users/login", credentials);
  return res.data;
}
