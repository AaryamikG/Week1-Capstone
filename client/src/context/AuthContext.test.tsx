import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "./useAuth";
import { TOKEN_STORAGE_KEY } from "../api/client";
import * as authApi from "../api/auth";
import { makeToken } from "../test/jwt-helpers";

vi.mock("../api/auth");

const user = { _id: "u1", email: "cook@example.com" };

function TestConsumer() {
  const { user: current, login, signup, logout } = useAuth();
  return (
    <div>
      <span data-testid="email">{current?.email ?? "anonymous"}</span>
      <button
        onClick={() =>
          login({ email: "cook@example.com", password: "pw" }).catch(() => {})
        }
      >
        login
      </button>
      <button
        onClick={() =>
          signup({ email: "cook@example.com", password: "pw" }).catch(() => {})
        }
      >
        signup
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

function renderConsumer() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("starts logged out with no stored token", () => {
    renderConsumer();
    expect(screen.getByTestId("email")).toHaveTextContent("anonymous");
  });

  it("logs in, exposes the user, and persists the token", async () => {
    const token = makeToken(user);
    vi.mocked(authApi.login).mockResolvedValue({ token });
    renderConsumer();

    await userEvent.click(screen.getByText("login"));

    await waitFor(() =>
      expect(screen.getByTestId("email")).toHaveTextContent("cook@example.com"),
    );
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe(token);
  });

  it("signs up, exposes the user, and persists the token", async () => {
    const token = makeToken(user);
    vi.mocked(authApi.signup).mockResolvedValue({ token });
    renderConsumer();

    await userEvent.click(screen.getByText("signup"));

    await waitFor(() =>
      expect(screen.getByTestId("email")).toHaveTextContent("cook@example.com"),
    );
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe(token);
  });

  it("logs out and clears the stored token", async () => {
    const token = makeToken(user);
    vi.mocked(authApi.login).mockResolvedValue({ token });
    renderConsumer();
    await userEvent.click(screen.getByText("login"));
    await waitFor(() =>
      expect(screen.getByTestId("email")).toHaveTextContent("cook@example.com"),
    );

    await userEvent.click(screen.getByText("logout"));

    expect(screen.getByTestId("email")).toHaveTextContent("anonymous");
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it("restores the session from a token already in storage", () => {
    const token = makeToken(user);
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    renderConsumer();
    expect(screen.getByTestId("email")).toHaveTextContent("cook@example.com");
  });

  it("clears an expired stored token instead of restoring it", () => {
    const token = makeToken(user, { expiresInSeconds: -10 });
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    renderConsumer();
    expect(screen.getByTestId("email")).toHaveTextContent("anonymous");
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it("leaves the user logged out when login fails", async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error("bad credentials"));
    renderConsumer();

    await userEvent.click(screen.getByText("login"));

    expect(screen.getByTestId("email")).toHaveTextContent("anonymous");
  });
});
