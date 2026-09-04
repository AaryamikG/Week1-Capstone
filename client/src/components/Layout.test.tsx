import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Layout from "./Layout";
import { AuthProvider } from "../context/AuthContext";

describe("Layout", () => {
  it("renders the navbar and the routed page content", () => {
    render(
      <MemoryRouter initialEntries={["/somewhere"]}>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/somewhere" element={<div>Page content</div>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText("spoonful")).toBeInTheDocument();
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });
});
