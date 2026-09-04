import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import * as recipesApi from "./api/recipes";

vi.mock("./api/recipes");

function renderApp(path: string) {
  vi.mocked(recipesApi.getRecipes).mockResolvedValue([]);
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("App routing", () => {
  it("renders the landing page at /", () => {
    renderApp("/");
    expect(screen.getByText("Recipes worth sharing.")).toBeInTheDocument();
  });

  it("renders the login page at /login", () => {
    renderApp("/login");
    expect(screen.getByRole("heading", { name: "Log in" })).toBeInTheDocument();
  });

  it("redirects /dashboard to /login when logged out", () => {
    renderApp("/dashboard");
    expect(screen.getByRole("heading", { name: "Log in" })).toBeInTheDocument();
  });

  it("renders a not-found page for an unknown route", () => {
    renderApp("/nope");
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });
});
