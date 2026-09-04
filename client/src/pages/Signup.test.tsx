import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Signup from "./Signup";
import { AuthProvider } from "../context/AuthContext";
import * as authApi from "../api/auth";
import { makeToken } from "../test/jwt-helpers";

vi.mock("../api/auth");

function renderSignup() {
  return render(
    <MemoryRouter initialEntries={["/signup"]}>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<div>Dashboard page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("Signup page", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("blocks submission when passwords don't match", async () => {
    renderSignup();

    await userEvent.type(screen.getByLabelText("Email"), "cook@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.type(
      screen.getByLabelText("Confirm password"),
      "different",
    );
    await userEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(
      await screen.findByText("Passwords do not match."),
    ).toBeInTheDocument();
    expect(authApi.signup).not.toHaveBeenCalled();
  });

  it("signs up and redirects to the dashboard on success", async () => {
    vi.mocked(authApi.signup).mockResolvedValue({
      token: makeToken({ _id: "u1", email: "cook@example.com" }),
    });
    renderSignup();

    await userEvent.type(screen.getByLabelText("Email"), "cook@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.type(
      screen.getByLabelText("Confirm password"),
      "password123",
    );
    await userEvent.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() =>
      expect(screen.getByText("Dashboard page")).toBeInTheDocument(),
    );
  });

  it("shows an error message when signup fails", async () => {
    vi.mocked(authApi.signup).mockRejectedValue(new Error("email taken"));
    renderSignup();

    await userEvent.type(screen.getByLabelText("Email"), "cook@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.type(
      screen.getByLabelText("Confirm password"),
      "password123",
    );
    await userEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(
      await screen.findByText("Could not create an account with those details."),
    ).toBeInTheDocument();
  });
});
