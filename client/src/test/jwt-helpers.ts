import type { User } from "../types";

function base64UrlEncode(json: object): string {
  const base64 = btoa(JSON.stringify(json));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function makeToken(
  user: User,
  { expiresInSeconds = 3600 }: { expiresInSeconds?: number } = {},
): string {
  const header = base64UrlEncode({ alg: "HS256", typ: "JWT" });
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode({
    user,
    iat: now,
    exp: now + expiresInSeconds,
  });
  return `${header}.${payload}.fake-signature`;
}
