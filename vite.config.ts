import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ManifestV3Export, crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig({
	plugins: [react(), crx({ manifest: manifest as ManifestV3Export })],
	define: {
		VERSION: JSON.stringify(process.env.npm_package_version),
	},
	build: {
		rollupOptions: {
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`,
			},
		},
	},
	server: {
		host: true,
		port: 8000,
		watch: {
			usePolling: true,
		},
	},
});
