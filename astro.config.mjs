// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://cruxcalc.netlify.app",
	integrations: [],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "src/styles/variables.scss";`,
				},
			},
		},
	},
});
