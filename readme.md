# Week 1 Capstone: React Application

#### What You'll Build

You will consume an API and render it using React. The Figma design and user stories are provided. Your job is to connect the frontend to the backend and deliver a working, deployed product.

#### Setup

Clone this repo into a new `unit-01-capstone` directory and `cd` into it:

```bash
git clone <repo-url> unit-01-capstone
cd unit-01-capstone
```

Remove the existing git history and start your own repo:

```bash
rm -rf .git
git init
git add .
git commit -m "setup starter code"
```

Then add a GitHub remote to the local repo.

#### Setup Backend

See the [backend commands reference](./backend/readme.md).

#### Consult Design Docs

See the [design docs](./design.md).

#### Build the React Frontend

Connect to your backend: your React app must call and use all the API endpoints you've built.

Set up routing: implement routing for navigation between all major app sections and components.

Responsive design: use CSS and Flexbox so your app looks good on mobile, tablet, and desktop.

Match the Figma design: strive for a pixel-perfect implementation of the provided UI.

Component testing: write tests for at least four different UI components.

See the [React client command reference](./client/readme.md).

#### Deploy Your Application

Deploy to S3, or as instructed in class.

Submit a working URL: make sure your deployed app is accessible and all main features work.

#### Must-Have Checklist

Complete all of the following to hit the baseline requirement for this capstone:

- Backend supports full CRUD, all endpoints in use.
- React app calls all endpoints.
- Routing set up for major components.
- Responsive CSS and Flexbox design.
- Pixel-perfect Figma implementation including mobile, tablet, and desktop.
- every react component tested.
- All helper functions, login, signup, logout functions unit tested.
- playwright end-to-end tests
- Deployed, working app with a public URL.

#### Stretch Goals

Complete one stretch goal for the mid-tier bonus, or both for the top tier:

- Use the context api, useReducer.  
- Set up GitHub Actions or other CI/CD for automated builds and tests.

#### Tips for Success

Work in small steps: build and test each part before moving on.

Stick to the blueprint: the Figma file and user stories define your target.

Ask questions: don't spend too long blocked. Help is here if you need it.
