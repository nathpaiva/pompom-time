import react from '@vitejs/plugin-react'
import { defineConfig, type UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { InlineConfig } from 'vitest'

interface VitestConfigExport extends UserConfig {
  test: InlineConfig
}

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    alias: {
      '@utils/test': new URL('./src/utils/testWrapper.tsx', import.meta.url)
        .pathname,
    },
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*'],
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/**/index.ts',
        'src/**/index.tsx',
        'src/**/*.d.ts',
        'src/**/mock.ts',
        'src/**/main.tsx',
      ],
      all: true,
      branches: 40,
      functions: 50,
      lines: 50,
      statements: 50,
      cleanOnRerun: false,
    },
  },
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 4200,
    watch: {
      usePolling: true,
    },
  },
} as VitestConfigExport)
