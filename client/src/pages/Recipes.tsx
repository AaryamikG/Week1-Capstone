import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import { getRecipes, type RecipeQuery } from "../api/recipes";
import type { Recipe } from "../types";
import "./Recipes.css";

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState<RecipeQuery>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getRecipes(query)
      .then((data) => {
        if (!cancelled) setRecipes(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load recipes right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="container recipes-page">
      <h1>Browse recipes</h1>
      <SearchBar onSearch={setQuery} />

      {loading && <p>Loading recipes...</p>}
      {error && <p className="field-error">{error}</p>}

      {!loading && !error && recipes.length === 0 && (
        <div className="empty-state">
          <p>No recipes match your search.</p>
        </div>
      )}

      {!loading && !error && recipes.length > 0 && (
        <div className="grid-recipes">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
