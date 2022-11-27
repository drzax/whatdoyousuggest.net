// vite.config.js
import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  build: {},
  optimizeDeps: {
    include: ["d3-scale", "d3-shape", "d3-scale-chromatic"],
  },
};

export default config;
