import api from "./client";
import type { Recipe, RecipeInput } from "../types";

export interface RecipeQuery {
  title?: string;
  tag?: string;
  ingredient?: string;
}

export async function getRecipes(query: RecipeQuery = {}): Promise<Recipe[]> {
  const res = await api.get<Recipe[]>("/api/recipes", { params: query });
  return res.data;
}

export async function getRecipe(id: string): Promise<Recipe> {
  const res = await api.get<Recipe>(`/api/recipes/${id}`);
  return res.data;
}

export async function createRecipe(data: RecipeInput): Promise<Recipe> {
  const res = await api.post<Recipe>("/api/recipes", data);
  return res.data;
}

export async function updateRecipe(
  id: string,
  data: RecipeInput,
): Promise<Recipe> {
  const res = await api.put<Recipe>(`/api/recipes/${id}`, data);
  return res.data;
}

export async function deleteRecipe(id: string): Promise<void> {
  await api.delete(`/api/recipes/${id}`);
}
