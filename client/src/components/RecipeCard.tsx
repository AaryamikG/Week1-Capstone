import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import RecipeImage from "./RecipeImage";
import type { Recipe } from "../types";

function formatDate(iso: string): string {
  const date = new Date(iso);
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear() % 100;
  return `${month}/${day}/${String(year).padStart(2, "0")}`;
}

export default function RecipeCard({
  recipe,
  canManage = false,
  onEdit,
  onDelete,
}: {
  recipe: Recipe;
  canManage?: boolean;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
}) {
  return (
    <div className="card">
      <Link to={`/recipes/${recipe._id}`}>
        <RecipeImage className="card-image" src={recipe.image} alt={recipe.title} />
      </Link>
      <div className="card-body">
        <Link to={`/recipes/${recipe._id}`}>
          <h3 className="card-title">{recipe.title}</h3>
        </Link>
        <p className="card-subtitle">Created on {formatDate(recipe.createdAt)}</p>
        <div className="card-tags">
          {recipe.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        {canManage && (
          <div className="card-actions">
            <button
              className="icon-btn"
              aria-label={`Edit ${recipe.title}`}
              onClick={() => onEdit?.(recipe)}
            >
              <Pencil size={18} />
            </button>
            <button
              className="icon-btn danger"
              aria-label={`Delete ${recipe.title}`}
              onClick={() => onDelete?.(recipe)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
