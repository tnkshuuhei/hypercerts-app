import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { loadEnvConfig } from "@next/env";

const r = (p: string) => resolve(__dirname, p);

loadEnvConfig(process.cwd());
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
  },
  resolve: {
    alias: {
      "@/": r("/"),
    },
  },
});
