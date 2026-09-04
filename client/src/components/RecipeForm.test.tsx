import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import RecipeForm from "./RecipeForm";
import type { Recipe } from "../types";

describe("RecipeForm", () => {
  it("shows validation errors and does not submit when required fields are missing", async () => {
    const onSubmit = vi.fn();
    render(
      <RecipeForm submitLabel="Create recipe" onSubmit={onSubmit} onCancel={vi.fn()} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Create recipe" }));

    expect(await screen.findByText("Title is required.")).toBeInTheDocument();
    expect(
      screen.getByText("Add at least one ingredient with a quantity."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Add at least one instruction step."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits cleaned, filtered data for a valid recipe", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <RecipeForm submitLabel="Create recipe" onSubmit={onSubmit} onCancel={vi.fn()} />,
    );

    await userEvent.type(screen.getByLabelText("Title"), "  Chickpea Stew  ");
    await userEvent.type(
      screen.getByPlaceholderText("Ingredient name"),
      "Chickpeas",
    );
    await userEvent.type(screen.getByPlaceholderText("Quantity"), "2 cups");
    await userEvent.type(
      screen.getByPlaceholderText("Step 1"),
      "Simmer everything.",
    );
    await userEvent.type(
      screen.getByLabelText("Tags (comma-separated)"),
      "vegan, easy",
    );
    await userEvent.click(screen.getByRole("button", { name: "Create recipe" }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Chickpea Stew",
      description: "",
      image: "",
      tags: ["vegan", "easy"],
      ingredients: [{ name: "Chickpeas", quantity: "2 cups" }],
      instructions: [{ step: 1, description: "Simmer everything." }],
    });
  });

  it("adds and removes ingredient rows", async () => {
    render(
      <RecipeForm submitLabel="Create recipe" onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    await userEvent.click(screen.getByText("Add ingredient"));
    expect(screen.getAllByPlaceholderText("Ingredient name")).toHaveLength(2);

    await userEvent.click(screen.getAllByLabelText("Remove ingredient")[0]);
    expect(screen.getAllByPlaceholderText("Ingredient name")).toHaveLength(1);
  });

  it("prefills fields from an initial recipe for editing", () => {
    const recipe: Recipe = {
      _id: "r1",
      title: "Chickpea Stew",
      description: "Cozy",
      image: "https://example.com/stew.jpg",
      ingredients: [{ name: "Chickpeas", quantity: "2 cups" }],
      instructions: [{ step: 1, description: "Simmer." }],
      tags: ["vegan"],
      ownerId: "owner1",
      createdAt: "2025-02-13T00:00:00.000Z",
      updatedAt: "2025-02-13T00:00:00.000Z",
    };
    render(
      <RecipeForm
        initialRecipe={recipe}
        submitLabel="Save changes"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Title")).toHaveValue("Chickpea Stew");
    expect(screen.getByPlaceholderText("Ingredient name")).toHaveValue(
      "Chickpeas",
    );
  });

  it("calls onCancel when cancel is clicked", async () => {
    const onCancel = vi.fn();
    render(
      <RecipeForm submitLabel="Create recipe" onSubmit={vi.fn()} onCancel={onCancel} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
