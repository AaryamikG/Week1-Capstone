import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import Navbar from "./Navbar";
import { AuthProvider } from "../context/AuthContext";
import { TOKEN_STORAGE_KEY } from "../api/client";
import { makeToken } from "../test/jwt-helpers";

function renderNavbar() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows log in and sign up links when logged out", () => {
    renderNavbar();
    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("shows dashboard and log out when logged in", () => {
    localStorage.setItem(
      TOKEN_STORAGE_KEY,
      makeToken({ _id: "u1", email: "cook@example.com" }),
    );
    renderNavbar();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
    expect(screen.queryByText("Sign up")).not.toBeInTheDocument();
  });

  it("clears the session when logging out", async () => {
    localStorage.setItem(
      TOKEN_STORAGE_KEY,
      makeToken({ _id: "u1", email: "cook@example.com" }),
    );
    renderNavbar();

    await userEvent.click(screen.getByText("Log out"));

    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });
});
