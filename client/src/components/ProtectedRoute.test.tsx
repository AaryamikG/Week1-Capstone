import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";
import { TOKEN_STORAGE_KEY } from "../api/client";
import { makeToken } from "../test/jwt-helpers";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<div>Login page</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Dashboard page</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("redirects to /login when there is no session", () => {
    renderAt("/dashboard");
    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("renders the protected content when logged in", () => {
    localStorage.setItem(
      TOKEN_STORAGE_KEY,
      makeToken({ _id: "u1", email: "cook@example.com" }),
    );
    renderAt("/dashboard");
    expect(screen.getByText("Dashboard page")).toBeInTheDocument();
  });
});
