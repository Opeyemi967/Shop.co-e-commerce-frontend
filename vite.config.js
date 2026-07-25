import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Make sure TTF files are properly served
  assetsInclude: ["**/*.ttf", "**/*.otf", "**/*.woff", "**/*.woff2"],
});
