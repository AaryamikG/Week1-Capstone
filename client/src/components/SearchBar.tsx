import { useEffect, useRef, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import type { RecipeQuery } from "../api/recipes";
import "./SearchBar.css";

const DEBOUNCE_MS = 300;

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: RecipeQuery) => void;
}) {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [ingredient, setIngredient] = useState("");
  const isFirstRender = useRef(true);

  function buildQuery(): RecipeQuery {
    return {
      title: title.trim() || undefined,
      tag: tag.trim() || undefined,
      ingredient: ingredient.trim() || undefined,
    };
  }

  // Results update dynamically as the user types (debounced), per design.md.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => onSearch(buildQuery()), DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, tag, ingredient]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch(buildQuery());
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <div className="search-input-wrap">
        <Search size={18} className="search-icon" aria-hidden="true" />
        <input
          className="field-input search-input"
          type="search"
          placeholder="Search recipes by title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Search by title"
        />
      </div>
      <input
        className="field-input search-input-narrow"
        type="text"
        placeholder="Tag"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        aria-label="Filter by tag"
      />
      <input
        className="field-input search-input-narrow"
        type="text"
        placeholder="Ingredient"
        value={ingredient}
        onChange={(e) => setIngredient(e.target.value)}
        aria-label="Filter by ingredient"
      />
      <button className="btn btn-primary" type="submit">
        Search
      </button>
    </form>
  );
}
