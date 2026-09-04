import { describe, expect, it } from "vitest";
import { decodeToken, getUserFromToken } from "./jwt";
import { makeToken } from "../test/jwt-helpers";

const user = { _id: "u1", email: "cook@example.com" };

describe("decodeToken", () => {
  it("decodes a well-formed token payload", () => {
    const token = makeToken(user);
    const decoded = decodeToken(token);
    expect(decoded?.user).toEqual(user);
  });

  it("returns null for a malformed token", () => {
    expect(decodeToken("not-a-jwt")).toBeNull();
  });

  it("returns null for garbage base64 content", () => {
    expect(decodeToken("a.b.c")).toBeNull();
  });
});

describe("getUserFromToken", () => {
  it("returns the user for a valid, unexpired token", () => {
    const token = makeToken(user);
    expect(getUserFromToken(token)).toEqual(user);
  });

  it("returns null for an expired token", () => {
    const token = makeToken(user, { expiresInSeconds: -10 });
    expect(getUserFromToken(token)).toBeNull();
  });

  it("returns null for an invalid token", () => {
    expect(getUserFromToken("garbage")).toBeNull();
  });
});
