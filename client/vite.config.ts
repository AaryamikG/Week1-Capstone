/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true,
    css: true,
    exclude: ["**/node_modules/**", "**/dist/**", "e2e/**"],
    // GitHub Actions' runner fails to spawn Vitest's default forked-process
    // workers ("failed to start forks worker"); worker threads have lower
    // overhead and don't hit the same restriction.
    pool: "threads",
  },
});
