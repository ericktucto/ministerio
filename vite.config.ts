/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import type { AliasOptions, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url';

// https://vite.dev/config/
export default defineConfig({
  base: '/ministerio/',
  test: {
    globals: true,
    environment: 'jsdom',
  },
  plugins: [vue(), tailwindcss()],
  server: {
    allowedHosts: true,
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      }
    ] as AliasOptions,
  },
}) satisfies UserConfigExport;
