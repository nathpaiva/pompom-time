import react from '@vitejs/plugin-react'
import { defineConfig, splitVendorChunkPlugin, type UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { InlineConfig } from 'vitest'
import { configDefaults } from 'vitest/config'

interface VitestConfigExport extends UserConfig {
  test: InlineConfig
}

const testConfig = {
  globals: true,
  clearMocks: true,
  setupFiles: ['./client/src/setupTests.ts'],
  environment: 'jsdom',
  alias: {
    '@utils/test': new URL(
      './client/src/utils/testWrapper.tsx',
      import.meta.url,
    ).pathname,
  },
  exclude: [...configDefaults.exclude, 'serverless'],
  coverage: {
    provider: 'v8',
    include: ['client/src/**/*'],
    reporter: ['text', 'json', 'html'],
    exclude: [
      'client/src/utils/testWrapper.ts',
      'client/src/utils/noop.ts',

      'client/src/**/index.ts',
      'client/src/**/index.tsx',
      'client/src/**/*.d.ts',
      'client/src/**/mock.ts',
      'client/src/**/main.tsx',

      // TODO: after create the theme, remove this line
      'client/src/utils/theme.ts',
      'client/src/colorPalette.ts',

      // serverless
      'serverless/**',
    ],
    all: true,
    branches: 90,
    functions: 80,
    lines: 90,
    statements: 90,
    cleanOnRerun: false,
  },
} satisfies VitestConfigExport['test']

const viteConfig = {
  test: testConfig,
  plugins: [splitVendorChunkPlugin(), react(), tsconfigPaths()],
  server: {
    port: 4200,
    watch: {
      usePolling: true,
    },
  },
} satisfies VitestConfigExport

export default defineConfig(viteConfig)
