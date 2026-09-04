import { test, expect } from "@playwright/test";

test.describe("creator recipe lifecycle", () => {
  test("signs up, creates, edits, deletes a recipe, then logs out", async ({
    page,
  }) => {
    const email = `e2e-${Date.now()}@example.com`;
    const password = "password123";

    await page.goto("/signup");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm password").fill(password);
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { name: "Your recipes" })).toBeVisible();

    await page.getByRole("button", { name: "New recipe" }).click();
    await page.getByLabel("Title").fill("E2E Chickpea Stew");
    await page.getByPlaceholder("Ingredient name").fill("Chickpeas");
    await page.getByPlaceholder("Quantity").fill("2 cups");
    await page.getByPlaceholder("Step 1").fill("Simmer everything.");
    await page.getByRole("button", { name: "Create recipe" }).click();

    await expect(page.getByText("Recipe created.")).toBeVisible();
    await expect(page.getByText("E2E Chickpea Stew")).toBeVisible();

    await page.getByLabel("Edit E2E Chickpea Stew").click();
    await page.getByLabel("Title").fill("E2E Chickpea Stew (updated)");
    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByText("Recipe updated.")).toBeVisible();
    await expect(page.getByText("E2E Chickpea Stew (updated)")).toBeVisible();

    await page.getByLabel("Delete E2E Chickpea Stew (updated)").click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(page.getByText("Recipe deleted.")).toBeVisible();
    await expect(
      page.getByText("E2E Chickpea Stew (updated)"),
    ).not.toBeVisible();

    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
  });
});
