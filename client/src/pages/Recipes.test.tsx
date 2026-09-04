import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Recipes from "./Recipes";
import * as recipesApi from "../api/recipes";
import type { Recipe } from "../types";

vi.mock("../api/recipes");

const stew: Recipe = {
  _id: "r1",
  title: "Chickpea Stew",
  ingredients: [{ name: "Chickpeas", quantity: "2 cups" }],
  instructions: [{ step: 1, description: "Simmer." }],
  tags: ["vegan"],
  ownerId: "owner1",
  createdAt: "2025-02-13T00:00:00.000Z",
  updatedAt: "2025-02-13T00:00:00.000Z",
};

function renderRecipes() {
  return render(
    <MemoryRouter>
      <Recipes />
    </MemoryRouter>,
  );
}

describe("Recipes page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders recipes returned by the API", async () => {
    vi.mocked(recipesApi.getRecipes).mockResolvedValue([stew]);
    renderRecipes();

    expect(await screen.findByText("Chickpea Stew")).toBeInTheDocument();
  });

  it("shows a no-match message when the search returns nothing", async () => {
    vi.mocked(recipesApi.getRecipes).mockResolvedValue([]);
    renderRecipes();

    expect(
      await screen.findByText("No recipes match your search."),
    ).toBeInTheDocument();
  });

  it("re-queries the API with search parameters", async () => {
    vi.mocked(recipesApi.getRecipes).mockResolvedValue([stew]);
    renderRecipes();
    await screen.findByText("Chickpea Stew");

    await userEvent.type(
      screen.getByLabelText("Search by title"),
      "Chickpea",
    );
    await userEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() =>
      expect(recipesApi.getRecipes).toHaveBeenLastCalledWith({
        title: "Chickpea",
        tag: undefined,
        ingredient: undefined,
      }),
    );
  });

  it("shows an error message when the request fails", async () => {
    vi.mocked(recipesApi.getRecipes).mockRejectedValue(new Error("network"));
    renderRecipes();

    expect(
      await screen.findByText("Could not load recipes right now."),
    ).toBeInTheDocument();
  });
});
