import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "prettier",
    "plugin:storybook/recommended",
  ),
  {
    rules: {
      // Permite unused vars com prefixo underscore
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      // Permite any em alguns casos específicos
      "@typescript-eslint/no-explicit-any": "warn",
      // Permite interfaces vazias (útil para extensões futuras)
      "@typescript-eslint/no-empty-object-type": "off",
      // Permite aspas em JSX (warning apenas)
      "react/no-unescaped-entities": "warn",
      // Permite dependencies exhaustivas como warning
      "react-hooks/exhaustive-deps": "warn",
    }
  }
];

export default eslintConfig;
