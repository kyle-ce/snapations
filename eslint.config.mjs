import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    // ✅ This is how you ignore files/folders now
    ignores: [
      "app/generated/prisma/**/*", // ignore Prisma client
      ".next/**/*", // ignore Next.js build output
      "node_modules/**/*", // ignore deps
      "dist/**/*", // ignore output if applicable
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
