import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "./Login";
import { AuthProvider } from "../context/AuthContext";
import * as authApi from "../api/auth";
import { makeToken } from "../test/jwt-helpers";

vi.mock("../api/auth");

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<div>Dashboard page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("Login page", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("logs in and redirects to the dashboard on success", async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      token: makeToken({ _id: "u1", email: "cook@example.com" }),
    });
    renderLogin();

    await userEvent.type(screen.getByLabelText("Email"), "cook@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() =>
      expect(screen.getByText("Dashboard page")).toBeInTheDocument(),
    );
  });

  it("shows an error message on invalid credentials", async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error("bad credentials"));
    renderLogin();

    await userEvent.type(screen.getByLabelText("Email"), "cook@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      await screen.findByText("Incorrect email or password."),
    ).toBeInTheDocument();
  });
});
