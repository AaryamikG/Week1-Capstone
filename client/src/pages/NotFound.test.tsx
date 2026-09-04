import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NotFound from "./NotFound";

describe("NotFound page", () => {
  it("shows a message and a link back home", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(screen.getByText("Back to home")).toHaveAttribute("href", "/");
  });
});
