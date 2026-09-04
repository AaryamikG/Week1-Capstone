import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import RecipeCard from "./RecipeCard";
import type { Recipe } from "../types";

const recipe: Recipe = {
  _id: "r1",
  title: "Chickpea Stew",
  description: "Cozy and warm",
  image: "https://example.com/stew.jpg",
  ingredients: [{ name: "Chickpeas", quantity: "2 cups" }],
  instructions: [{ step: 1, description: "Simmer everything." }],
  tags: ["Vegan", "Gluten-free"],
  ownerId: "owner1",
  createdAt: "2025-02-13T00:00:00.000Z",
  updatedAt: "2025-02-13T00:00:00.000Z",
};

function renderCard(props: Partial<React.ComponentProps<typeof RecipeCard>> = {}) {
  return render(
    <MemoryRouter>
      <RecipeCard recipe={recipe} {...props} />
    </MemoryRouter>,
  );
}

describe("RecipeCard", () => {
  it("shows the title, formatted date, and tags", () => {
    renderCard();
    expect(screen.getByText("Chickpea Stew")).toBeInTheDocument();
    expect(screen.getByText("Created on 2/13/25")).toBeInTheDocument();
    expect(screen.getByText("Vegan")).toBeInTheDocument();
    expect(screen.getByText("Gluten-free")).toBeInTheDocument();
  });

  it("links the title and image to the recipe detail page", () => {
    renderCard();
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/recipes/r1");
  });

  it("hides edit/delete controls by default", () => {
    renderCard();
    expect(screen.queryByLabelText(/edit/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/delete/i)).not.toBeInTheDocument();
  });

  it("shows edit/delete controls and fires callbacks when managed", async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    renderCard({ canManage: true, onEdit, onDelete });

    await userEvent.click(screen.getByLabelText(/edit chickpea stew/i));
    expect(onEdit).toHaveBeenCalledWith(recipe);

    await userEvent.click(screen.getByLabelText(/delete chickpea stew/i));
    expect(onDelete).toHaveBeenCalledWith(recipe);
  });
});
