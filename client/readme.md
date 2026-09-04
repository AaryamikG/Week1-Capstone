# Client

This directory contains the client-side code for the Spoonful application.

#### Running the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

Set `VITE_API_URL` (see `.env.example`) if the backend isn't running at the default `http://localhost:3000`.

#### Running Tests

To run the unit and component test suite, use the following command:

```bash
npm run test
```

To run it in watch mode while developing:

```bash
npm run test:watch
```

#### End-to-End Tests

Playwright drives the app in a real browser against a running backend. Start the backend first (see the [backend commands reference](../backend/readme.md)), then run:

```bash
npm run e2e
```

This starts the Vite dev server automatically and runs the specs in `e2e/`.

#### Linting

```bash
npm run lint
```

#### Building for Production

To create a production build of the application, run the following command:

```bash
npm run build
```

Use this command to bundle the application for deployment. The build artifacts will be located in the `dist` directory.
