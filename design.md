# Design Document

This document outlines the design and user stories for the Spoonful application.

Figma link: [Spoonful Figma Design](https://www.figma.com/design/4UKIjxdUxW0IodUmodX8j7/Spoonful?node-id=1-2082) for CSS and design.

#### Core Features

- Landing Page: welcome message and call-to-action, available to all users.
- Authentication: email and password login, available to creators only.
- Recipe Creation: form input for title, photo, ingredients, and instructions, available to creators only.
- Recipe Update: edit existing recipe entries, available to creators only.
- Recipe Deletion: delete a recipe with confirmation, available to creators only.
- Browse Recipes: public recipe viewing, available to all users.
- Search and Filter: find recipes by keyword, tag, or ingredient, available to all users.

#### Key Flows

The backend server runs on `localhost:3000`. Axios should be used for API calls.

##### Landing Page

`GET /` is the public entry point.

Show a call-to-action with two options: Explore Recipes routes to `/recipes` (the public index), and Login routes to `/login`.

##### Login and Signup

`POST /api/users/login` and `POST /api/users/signup` handle the auth flow for creators only.

On success, redirect to `/dashboard`. Protect `/dashboard` and the recipe CRUD routes with an auth guard.

##### Create Recipe

`POST /api/recipes` is accessible from `/dashboard`.

Form inputs are title, image, ingredients, instructions, tags, and description. For the image, just use a link (Imgur or similar) in a regular input instead of a file upload.

Validate, submit, then show a success toast or modal. Update the UI without a reload.

Example format of the data:

```js
{
  "title": "Steak baby!",
  "description": "Crunchy romaine with creamy cashew Caesar dressing.",
  "image": "https://example.com/images/vegan-caesar.jpg",
  "ingredients": [
    { "name": "Romaine lettuce", "quantity": "1 head" },
    { "name": "Cashews", "quantity": "1/2 cup" },
    { "name": "Lemon juice", "quantity": "2 tbsp" },
    { "name": "Dijon mustard", "quantity": "1 tsp" },
    { "name": "Garlic clove", "quantity": "1" }
  ],
  "instructions": [
    { "step": 1, "description": "Blend the cashews, lemon juice, mustard, and garlic until smooth." },
    { "step": 2, "description": "Chop romaine lettuce and place in a bowl." },
    { "step": 3, "description": "Toss with the blended dressing and serve chilled." }
  ],
  "tags": ["vegan", "salad", "healthy"]
}
```

##### Update Recipe

`PUT /api/recipes/:id` is triggered by clicking Edit on a dashboard item.

Prefill the form with existing data. On submit, update the recipe, show success, and refresh the list.

##### Delete Recipe

`DELETE /api/recipes/:id` is triggered by a button in the dashboard.

Show a confirm dialog, and on accept, delete the recipe and update the UI. Handle edge cases like 404s and permission errors.

##### Browse and Search Recipes

`GET /api/recipes` is publicly accessible.

Show a list with a search input. Query by title, tag, or ingredient. Clicking a recipe card routes to `GET /recipes/:id`.

#### User Stories

##### Recipe Management

As a recipe creator, I want to add new recipes so I can store and share them.

Acceptance criteria: the form includes title, image, ingredients, and instructions. Required fields are validated. A success message shows on submission.

As any user, I want to view a list of recipes so I can find something to cook.

Acceptance criteria: recipe cards show key info. Clicking one opens the full recipe. This works for both logged-in and guest users.

As a creator, I want to edit my recipe so I can fix or improve it.

Acceptance criteria: an Edit button appears on the creator dashboard. A prefilled form loads existing data. Saving updates the recipe.

As a creator, I want to delete my recipe so I can manage my content.

Acceptance criteria: a Delete button appears on the dashboard. A confirmation prompt is required. The recipe is removed from all views on success.

##### Recipe Discovery

As a viewer, I want to search by keyword so I can quickly find recipes.

Acceptance criteria: a search input is visible on the browse page. Results update dynamically. A "no match" message shows if there are no results.

As a visitor, I want to browse recipes without logging in.

Acceptance criteria: no login is required to view recipes. Access to recipe content is read-only.
