import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 3000,
	},
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.js"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json-summary", "html"],
			include: ["src/**/*.{js,ts,svelte}"],
			exclude: ["src/**/*.d.ts", "src/**/*.css", "src/**/*.html"],
			thresholds: {
				lines: 100,
				functions: 100,
				branches: 100,
				statements: 100,
			},
		},
	},
});
