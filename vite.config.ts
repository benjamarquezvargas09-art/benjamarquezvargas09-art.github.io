import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    cssCodeSplit: true,
    // three.js vive en su propio chunk y se carga después del primer render.
    chunkSizeWarningLimit: 700,
  },
});
