import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src/'),
		},
	},
	build: {
		chunkSizeWarningLimit: 1600,
		rollupOptions: {
			external: [/^node:.*/],
		},
	},
});
