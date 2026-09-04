import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RecipeDetail from "./RecipeDetail";
import * as recipesApi from "../api/recipes";
import type { Recipe } from "../types";

vi.mock("../api/recipes");

const stew: Recipe = {
  _id: "r1",
  title: "Chickpea Stew",
  description: "Cozy and warm",
  ingredients: [{ name: "Chickpeas", quantity: "2 cups" }],
  instructions: [
    { step: 2, description: "Serve hot." },
    { step: 1, description: "Simmer everything." },
  ],
  tags: ["vegan"],
  ownerId: "owner1",
  createdAt: "2025-02-13T00:00:00.000Z",
  updatedAt: "2025-02-13T00:00:00.000Z",
};

function renderDetail(id = "r1") {
  return render(
    <MemoryRouter initialEntries={[`/recipes/${id}`]}>
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/recipes" element={<div>Recipes list</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("RecipeDetail page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the recipe with ingredients and ordered instructions", async () => {
    vi.mocked(recipesApi.getRecipe).mockResolvedValue(stew);
    renderDetail();

    expect(await screen.findByText("Chickpea Stew")).toBeInTheDocument();
    expect(screen.getByText("Cozy and warm")).toBeInTheDocument();
    expect(screen.getByText(/Chickpeas/)).toBeInTheDocument();

    const steps = screen.getAllByRole("listitem").map((li) => li.textContent);
    const simmerIndex = steps.findIndex((text) =>
      text?.includes("Simmer everything."),
    );
    const serveIndex = steps.findIndex((text) => text?.includes("Serve hot."));
    expect(simmerIndex).toBeLessThan(serveIndex);
  });

  it("shows a not-found state for a missing recipe", async () => {
    vi.mocked(recipesApi.getRecipe).mockRejectedValue(new Error("404"));
    renderDetail("missing");

    expect(
      await screen.findByText("We couldn't find that recipe."),
    ).toBeInTheDocument();
  });
});
