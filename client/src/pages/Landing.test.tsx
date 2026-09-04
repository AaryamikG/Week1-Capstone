import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Landing from "./Landing";

describe("Landing page", () => {
  it("links Explore Recipes to /recipes and Log in to /login", () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>,
    );

    expect(screen.getByText("Explore Recipes")).toHaveAttribute(
      "href",
      "/recipes",
    );
    expect(screen.getByText("Log in")).toHaveAttribute("href", "/login");
  });
});
