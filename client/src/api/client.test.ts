import { AxiosHeaders } from "axios";
import { beforeEach, describe, expect, it } from "vitest";
import { attachAuthToken, TOKEN_STORAGE_KEY } from "./client";

function buildConfig() {
  return { headers: new AxiosHeaders() } as Parameters<typeof attachAuthToken>[0];
}

describe("attachAuthToken", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("attaches an Authorization header when a token is stored", () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, "abc123");
    const config = attachAuthToken(buildConfig());
    expect(config.headers.get("Authorization")).toBe("Bearer abc123");
  });

  it("omits the Authorization header when no token is stored", () => {
    const config = attachAuthToken(buildConfig());
    expect(config.headers.get("Authorization")).toBeUndefined();
  });
});
