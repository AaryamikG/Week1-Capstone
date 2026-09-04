import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Logo from "./Logo";

describe("Logo", () => {
  it("renders the wordmark and links to home", () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>,
    );

    expect(screen.getByText("spoonful")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });
});
