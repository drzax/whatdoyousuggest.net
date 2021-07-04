import preprocess from "svelte-preprocess";
import netlify from "@sveltejs/adapter-netlify";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess()],

  kit: {
    adapter: netlify(),
    target: "#svelte",
    vite: {
      build: {
        sourcemap: true,
      },
      optimizeDeps: {
        include: ["d3-scale", "d3-shape", "d3-scale-chromatic"],
      },
    },
  },
};

export default config;
