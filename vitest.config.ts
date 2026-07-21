import { defineConfig } from "vitest/config";

export default defineConfig({
  // Resolves the `@/*` -> `src/*` alias from tsconfig, so tests import modules
  // by the same specifier the app does.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Live provider round-trips are opt-in via `npm run test:live`; the default
    // run stays offline and deterministic.
    exclude: ["**/node_modules/**", "**/*.integration.test.ts"],
  },
});
