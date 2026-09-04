import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRecipe } from "../api/recipes";
import RecipeImage from "../components/RecipeImage";
import type { Recipe } from "../types";
import "./RecipeDetail.css";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    getRecipe(id)
      .then((data) => {
        if (!cancelled) setRecipe(data);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container recipe-detail">
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (notFound || !recipe) {
    return (
      <div className="container recipe-detail">
        <div className="empty-state">
          <p>We couldn&apos;t find that recipe.</p>
          <Link to="/recipes" className="btn btn-outline">
            Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container recipe-detail">
      <Link to="/recipes" className="btn-text">
        &larr; Back to recipes
      </Link>
      <div className="recipe-detail-header">
        <RecipeImage
          className="recipe-detail-image"
          src={recipe.image}
          alt={recipe.title}
        />
        <div>
          <h1>{recipe.title}</h1>
          {recipe.description && <p>{recipe.description}</p>}
          <div className="card-tags">
            {recipe.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="recipe-detail-body">
        <section>
          <h2>Ingredients</h2>
          <ul className="ingredient-list">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>
                <strong>{ing.quantity}</strong> {ing.name}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Instructions</h2>
          <ol className="instruction-list">
            {recipe.instructions
              .slice()
              .sort((a, b) => a.step - b.step)
              .map((step) => (
                <li key={step.step}>{step.description}</li>
              ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
