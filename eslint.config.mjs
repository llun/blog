import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "public/**",
      ".yarn/**",
      "scripts/simplify/**",
      "scripts/streams/**",
      "scripts/netherlands/**",
      "scripts/singapore/**",
      "scripts/slovenia/**",
      "**/*.js",
      "**/*.mjs",
      "**/*.cjs"
    ],
  },
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    }
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ]
    }
  }
);
