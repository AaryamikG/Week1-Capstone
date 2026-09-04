import { test, expect } from "@playwright/test";

test.describe("guest browsing", () => {
  test("can reach the landing page and navigate to recipes without logging in", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Recipes worth sharing." }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Explore Recipes" }).click();
    await expect(page).toHaveURL(/\/recipes$/);
    await expect(page.getByRole("heading", { name: "Browse recipes" })).toBeVisible();
  });

  test("shows a no-match state for a search with no results", async ({ page }) => {
    await page.goto("/recipes");
    await page
      .getByLabel("Search by title")
      .fill(`no-such-recipe-${Date.now()}`);
    await page.getByRole("button", { name: "Search" }).click();

    await expect(page.getByText("No recipes match your search.")).toBeVisible();
  });

  test("cannot open the dashboard without logging in", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });
});
