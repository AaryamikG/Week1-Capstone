import type { User } from "../types";

interface TokenPayload {
  user: User;
  iat: number;
  exp: number;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const json = atob(padded);
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

export function getUserFromToken(token: string): User | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  if (decoded.exp * 1000 < Date.now()) return null;
  return decoded.user;
}
