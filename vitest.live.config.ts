import { defineConfig } from "vitest/config";

// Config for the opt-in live provider round-trips (`npm run test:live`). Kept
// separate from the default config, whose `exclude` deliberately hides these so
// a normal run never touches the network.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.integration.test.ts"],
  },
});
