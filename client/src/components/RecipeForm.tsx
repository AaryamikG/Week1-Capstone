import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Ingredient, Instruction, Recipe, RecipeInput } from "../types";
import "./RecipeForm.css";

interface FormErrors {
  title?: string;
  ingredients?: string;
  instructions?: string;
}

function toFormState(recipe?: Recipe) {
  return {
    title: recipe?.title ?? "",
    description: recipe?.description ?? "",
    image: recipe?.image ?? "",
    tags: recipe?.tags.join(", ") ?? "",
    ingredients: recipe?.ingredients.length
      ? recipe.ingredients
      : ([{ name: "", quantity: "" }] as Ingredient[]),
    instructions: recipe?.instructions.length
      ? recipe.instructions
      : ([{ step: 1, description: "" }] as Instruction[]),
  };
}

export default function RecipeForm({
  initialRecipe,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initialRecipe?: Recipe;
  submitLabel: string;
  onSubmit: (data: RecipeInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(() => toFormState(initialRecipe));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing,
      ),
    }));
  }

  function addIngredient() {
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: "" }],
    }));
  }

  function removeIngredient(index: number) {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  }

  function updateInstruction(index: number, description: string) {
    setForm((prev) => ({
      ...prev,
      instructions: prev.instructions.map((step, i) =>
        i === index ? { ...step, description } : step,
      ),
    }));
  }

  function addInstruction() {
    setForm((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { step: prev.instructions.length + 1, description: "" },
      ],
    }));
  }

  function removeInstruction(index: number) {
    setForm((prev) => ({
      ...prev,
      instructions: prev.instructions
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, step: i + 1 })),
    }));
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required.";
    const hasIngredient = form.ingredients.some(
      (ing) => ing.name.trim() && ing.quantity.trim(),
    );
    if (!hasIngredient) {
      nextErrors.ingredients = "Add at least one ingredient with a quantity.";
    }
    const hasInstruction = form.instructions.some((step) => step.description.trim());
    if (!hasInstruction) {
      nextErrors.instructions = "Add at least one instruction step.";
    }
    return nextErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        ingredients: form.ingredients.filter(
          (ing) => ing.name.trim() && ing.quantity.trim(),
        ),
        instructions: form.instructions
          .filter((step) => step.description.trim())
          .map((step, i) => ({ step: i + 1, description: step.description.trim() })),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="recipe-form stack" onSubmit={handleSubmit}>
      <div className="field">
        <label className="field-label" data-error={!!errors.title} htmlFor="recipe-title">
          Title
        </label>
        <input
          id="recipe-title"
          className="field-input"
          data-error={!!errors.title}
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Chickpea Stew"
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="recipe-description">
          Description
        </label>
        <textarea
          id="recipe-description"
          className="field-input"
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="A short description of the dish"
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="recipe-image">
          Image URL
        </label>
        <input
          id="recipe-image"
          className="field-input"
          value={form.image}
          onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
          placeholder="https://example.com/images/dish.jpg"
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="recipe-tags">
          Tags (comma-separated)
        </label>
        <input
          id="recipe-tags"
          className="field-input"
          value={form.tags}
          onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
          placeholder="vegan, salad, healthy"
        />
      </div>

      <div className="field">
        <span className="field-label" data-error={!!errors.ingredients}>
          Ingredients
        </span>
        {form.ingredients.map((ing, i) => (
          <div className="row form-list-row" key={i}>
            <input
              className="field-input"
              placeholder="Ingredient name"
              value={ing.name}
              onChange={(e) => updateIngredient(i, "name", e.target.value)}
            />
            <input
              className="field-input form-list-qty"
              placeholder="Quantity"
              value={ing.quantity}
              onChange={(e) => updateIngredient(i, "quantity", e.target.value)}
            />
            <button
              type="button"
              className="icon-btn danger"
              aria-label="Remove ingredient"
              onClick={() => removeIngredient(i)}
              disabled={form.ingredients.length === 1}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {errors.ingredients && <span className="field-error">{errors.ingredients}</span>}
        <button type="button" className="btn btn-text btn-sm" onClick={addIngredient}>
          <Plus size={16} /> Add ingredient
        </button>
      </div>

      <div className="field">
        <span className="field-label" data-error={!!errors.instructions}>
          Instructions
        </span>
        {form.instructions.map((step, i) => (
          <div className="row form-list-row" key={i}>
            <span className="step-number">{i + 1}.</span>
            <input
              className="field-input"
              placeholder={`Step ${i + 1}`}
              value={step.description}
              onChange={(e) => updateInstruction(i, e.target.value)}
            />
            <button
              type="button"
              className="icon-btn danger"
              aria-label="Remove step"
              onClick={() => removeInstruction(i)}
              disabled={form.instructions.length === 1}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {errors.instructions && (
          <span className="field-error">{errors.instructions}</span>
        )}
        <button type="button" className="btn btn-text btn-sm" onClick={addInstruction}>
          <Plus size={16} /> Add step
        </button>
      </div>

      <div className="row form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
