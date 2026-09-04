export interface User {
  _id: string;
  email: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Instruction {
  step: number;
  description: string;
}

export interface Recipe {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tags: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export type RecipeInput = Pick<
  Recipe,
  "title" | "description" | "image" | "ingredients" | "instructions" | "tags"
>;

export interface AuthResponse {
  token: string;
}
