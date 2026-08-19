import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Agent worktrees: checkouts of this same repo, each with its own node_modules.
    // Linting them buries the project's own findings and is already git-excluded.
    ".claude/worktrees/**",
    // The 2026 design handoff: HTML prototypes and the runtime that drives them. They are
    // reference material to read values out of, explicitly not code to port, and they are
    // written against a different React era — linting them says nothing about this app.
    "design_handoff_2026_redesign/**",
  ]),
]);

export default eslintConfig;
