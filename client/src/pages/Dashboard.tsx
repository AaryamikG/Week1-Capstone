import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import RecipeForm from "../components/RecipeForm";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import {
  createRecipe,
  deleteRecipe,
  getRecipes,
  updateRecipe,
} from "../api/recipes";
import type { Recipe, RecipeInput } from "../types";
import "./Dashboard.css";

type PanelState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; recipe: Recipe };

function getErrorStatus(err: unknown): number | undefined {
  return (err as { response?: { status?: number } })?.response?.status;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState<PanelState>({ mode: "closed" });
  const [pendingDelete, setPendingDelete] = useState<Recipe | null>(null);

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getRecipes();
      setRecipes(all.filter((recipe) => recipe.ownerId === user?._id));
    } catch {
      showToast("error", "Could not load your recipes.");
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  async function handleCreate(data: RecipeInput) {
    try {
      await createRecipe(data);
      showToast("success", "Recipe created.");
      setPanel({ mode: "closed" });
      await loadRecipes();
    } catch {
      showToast("error", "Could not create the recipe.");
    }
  }

  async function handleUpdate(id: string, data: RecipeInput) {
    try {
      await updateRecipe(id, data);
      showToast("success", "Recipe updated.");
      setPanel({ mode: "closed" });
      await loadRecipes();
    } catch (err) {
      const status = getErrorStatus(err);
      if (status === 404) {
        showToast("error", "That recipe no longer exists.");
        setPanel({ mode: "closed" });
        await loadRecipes();
      } else if (status === 403) {
        showToast("error", "You don't have permission to edit this recipe.");
      } else {
        showToast("error", "Could not update the recipe.");
      }
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await deleteRecipe(pendingDelete._id);
      showToast("success", "Recipe deleted.");
      setRecipes((prev) => prev.filter((r) => r._id !== pendingDelete._id));
    } catch (err) {
      const status = getErrorStatus(err);
      if (status === 404) {
        showToast("error", "That recipe no longer exists.");
        setRecipes((prev) => prev.filter((r) => r._id !== pendingDelete._id));
      } else if (status === 403) {
        showToast("error", "You don't have permission to delete this recipe.");
      } else {
        showToast("error", "Could not delete the recipe.");
      }
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div className="container dashboard-page">
      <div className="row dashboard-header">
        <h1>Your recipes</h1>
        <button
          className="btn btn-primary"
          onClick={() => setPanel({ mode: "create" })}
        >
          <Plus size={18} /> New recipe
        </button>
      </div>

      {loading && <p>Loading your recipes...</p>}

      {!loading && recipes.length === 0 && (
        <div className="empty-state">
          <p>You haven&apos;t published any recipes yet.</p>
        </div>
      )}

      {!loading && recipes.length > 0 && (
        <div className="grid-recipes">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              canManage
              onEdit={(r) => setPanel({ mode: "edit", recipe: r })}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      )}

      {panel.mode === "create" && (
        <Modal title="New recipe" onClose={() => setPanel({ mode: "closed" })}>
          <RecipeForm
            submitLabel="Create recipe"
            onSubmit={handleCreate}
            onCancel={() => setPanel({ mode: "closed" })}
          />
        </Modal>
      )}

      {panel.mode === "edit" && (
        <Modal title="Edit recipe" onClose={() => setPanel({ mode: "closed" })}>
          <RecipeForm
            initialRecipe={panel.recipe}
            submitLabel="Save changes"
            onSubmit={(data) => handleUpdate(panel.recipe._id, data)}
            onCancel={() => setPanel({ mode: "closed" })}
          />
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete recipe"
          message={`Are you sure you want to delete "${pendingDelete.title}"? This can't be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
