import { defineConfig } from "vite";
//Exercise 3 - Demo 6 using react
import react from "@vitejs/plugin-react";

//Demo 9: GitHub Pages serves this repository under /<repo>/, so built assets must be relative.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
