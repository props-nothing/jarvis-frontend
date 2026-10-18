import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { pages } from "./src/site.ts";

export default defineConfig({
  plugins: [react()],
  appType: "mpa",
  build: {
    target: "es2022",
    sourcemap: false,
    manifest: true,
    rolldownOptions: { input: pages.map((page) => page.file) },
  },
});
