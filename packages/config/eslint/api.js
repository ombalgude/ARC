import { config as baseConfig } from "./base.js";
import globals from "globals";

/**
 * A custom ESLint configuration for backend API services.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const apiConfig = [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
    },
  },
];
