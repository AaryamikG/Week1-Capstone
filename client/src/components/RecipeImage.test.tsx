import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RecipeImage from "./RecipeImage";

describe("RecipeImage", () => {
  it("uses the given src when provided", () => {
    render(<RecipeImage src="https://example.com/stew.jpg" alt="Stew" />);
    expect(screen.getByAltText("Stew")).toHaveAttribute(
      "src",
      "https://example.com/stew.jpg",
    );
  });

  it("falls back to the placeholder when no src is given", () => {
    render(<RecipeImage alt="Stew" />);
    expect(screen.getByAltText("Stew")).toHaveAttribute(
      "src",
      "/placeholder-recipe.svg",
    );
  });

  it("swaps to the placeholder if the image fails to load", () => {
    render(<RecipeImage src="https://example.com/broken.jpg" alt="Stew" />);
    const img = screen.getByAltText("Stew");
    fireEvent.error(img);
    expect(img).toHaveAttribute("src", "/placeholder-recipe.svg");
  });
});
