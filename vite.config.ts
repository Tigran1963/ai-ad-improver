import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error: postcss-sort-media-queries does not have type declarations
import postcssSortMediaQueries from 'postcss-sort-media-queries'
import autoprefixer from 'autoprefixer';
import svgr from "vite-plugin-svgr";

export default defineConfig({
	plugins: [react(), svgr()],
	server: {
		proxy: {
			'/items': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				secure: false,
			}
		}
	},
	css: {
		postcss: {
			plugins: [
				postcssSortMediaQueries(),
				autoprefixer(),
			],
		},
		preprocessorOptions: {
			scss: {
				additionalData: `
				@use "sass:math";
				@use "@/styles/_variables.scss" as *;`
			}
		}
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
	},
})
