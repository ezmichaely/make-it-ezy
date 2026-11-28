import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/**/*.test.ts", "apps/**/*.test.ts", "tests/**/*.test.ts"],
    // Cold-start CLI smoke tests spawn tsx and can occasionally exceed Vitest's
    // 5000ms default on a cold machine (historical outlier: 5578ms). 10s keeps
    // a safety margin without masking genuinely hung tests.
    testTimeout: 10_000,
  },
});