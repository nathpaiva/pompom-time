/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, type UserConfig } from 'vite'
import type { InlineConfig } from 'vitest'

import react from '@vitejs/plugin-react'

interface VitestConfigExport extends UserConfig {
  test: InlineConfig
}

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
  plugins: [react()],
  server: {
    port: 4200,
    watch: {
      usePolling: true,
    },
  },
} as VitestConfigExport)
