import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "./Dashboard";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";
import { TOKEN_STORAGE_KEY } from "../api/client";
import { makeToken } from "../test/jwt-helpers";
import * as recipesApi from "../api/recipes";
import type { Recipe } from "../types";

vi.mock("../api/recipes");

const me = { _id: "u1", email: "cook@example.com" };

const myRecipe: Recipe = {
  _id: "r1",
  title: "My Stew",
  ingredients: [{ name: "Chickpeas", quantity: "2 cups" }],
  instructions: [{ step: 1, description: "Simmer." }],
  tags: ["vegan"],
  ownerId: "u1",
  createdAt: "2025-02-13T00:00:00.000Z",
  updatedAt: "2025-02-13T00:00:00.000Z",
};

const othersRecipe: Recipe = {
  ...myRecipe,
  _id: "r2",
  title: "Someone Else's Curry",
  ownerId: "u2",
};

function renderDashboard() {
  localStorage.setItem(TOKEN_STORAGE_KEY, makeToken(me));
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ToastProvider>
          <Dashboard />
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("Dashboard page", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("shows only the current user's recipes", async () => {
    vi.mocked(recipesApi.getRecipes).mockResolvedValue([myRecipe, othersRecipe]);
    renderDashboard();

    expect(await screen.findByText("My Stew")).toBeInTheDocument();
    expect(screen.queryByText("Someone Else's Curry")).not.toBeInTheDocument();
  });

  it("shows an empty state when the user has no recipes", async () => {
    vi.mocked(recipesApi.getRecipes).mockResolvedValue([othersRecipe]);
    renderDashboard();

    expect(
      await screen.findByText("You haven't published any recipes yet."),
    ).toBeInTheDocument();
  });

  it("creates a recipe and refreshes the list", async () => {
    vi.mocked(recipesApi.getRecipes)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([myRecipe]);
    vi.mocked(recipesApi.createRecipe).mockResolvedValue(myRecipe);
    renderDashboard();

    await screen.findByText("You haven't published any recipes yet.");
    await userEvent.click(screen.getByRole("button", { name: /new recipe/i }));

    await userEvent.type(screen.getByLabelText("Title"), "My Stew");
    await userEvent.type(
      screen.getByPlaceholderText("Ingredient name"),
      "Chickpeas",
    );
    await userEvent.type(screen.getByPlaceholderText("Quantity"), "2 cups");
    await userEvent.type(screen.getByPlaceholderText("Step 1"), "Simmer.");
    await userEvent.click(screen.getByRole("button", { name: "Create recipe" }));

    await waitFor(() => expect(recipesApi.createRecipe).toHaveBeenCalledOnce());
    expect(await screen.findByText("Recipe created.")).toBeInTheDocument();
  });

  it("opens the edit form prefilled and saves changes", async () => {
    vi.mocked(recipesApi.getRecipes).mockResolvedValue([myRecipe]);
    vi.mocked(recipesApi.updateRecipe).mockResolvedValue(myRecipe);
    renderDashboard();

    await screen.findByText("My Stew");
    await userEvent.click(screen.getByLabelText("Edit My Stew"));

    expect(screen.getByLabelText("Title")).toHaveValue("My Stew");

    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() =>
      expect(recipesApi.updateRecipe).toHaveBeenCalledWith(
        "r1",
        expect.objectContaining({ title: "My Stew" }),
      ),
    );
  });

  it("shows a specific message and removes the recipe on a 404 while editing", async () => {
    vi.mocked(recipesApi.getRecipes)
      .mockResolvedValueOnce([myRecipe])
      .mockResolvedValueOnce([]);
    vi.mocked(recipesApi.updateRecipe).mockRejectedValue({
      response: { status: 404 },
    });
    renderDashboard();

    await screen.findByText("My Stew");
    await userEvent.click(screen.getByLabelText("Edit My Stew"));
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText("That recipe no longer exists."),
    ).toBeInTheDocument();
  });

  it("shows a permission message on a 403 while editing", async () => {
    vi.mocked(recipesApi.getRecipes).mockResolvedValue([myRecipe]);
    vi.mocked(recipesApi.updateRecipe).mockRejectedValue({
      response: { status: 403 },
    });
    renderDashboard();

    await screen.findByText("My Stew");
    await userEvent.click(screen.getByLabelText("Edit My Stew"));
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText("You don't have permission to edit this recipe."),
    ).toBeInTheDocument();
  });

  it("deletes a recipe after confirming", async () => {
    vi.mocked(recipesApi.getRecipes).mockResolvedValue([myRecipe]);
    vi.mocked(recipesApi.deleteRecipe).mockResolvedValue(undefined);
    renderDashboard();

    await screen.findByText("My Stew");
    await userEvent.click(screen.getByLabelText("Delete My Stew"));
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(recipesApi.deleteRecipe).toHaveBeenCalledWith("r1"));
    expect(await screen.findByText("Recipe deleted.")).toBeInTheDocument();
    expect(screen.queryByText("My Stew")).not.toBeInTheDocument();
  });

  it("cancels deletion without calling the API", async () => {
    vi.mocked(recipesApi.getRecipes).mockResolvedValue([myRecipe]);
    renderDashboard();

    await screen.findByText("My Stew");
    await userEvent.click(screen.getByLabelText("Delete My Stew"));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(recipesApi.deleteRecipe).not.toHaveBeenCalled();
    expect(screen.getByText("My Stew")).toBeInTheDocument();
  });
});
