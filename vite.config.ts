import { defineConfig } from "vite";

//Demo 9: GitHub Pages serves this repository under /<repo>/, so built assets must be relative.
export default defineConfig({
  base: "./",
});
