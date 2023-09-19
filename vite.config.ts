import react from '@vitejs/plugin-react'
import { defineConfig, splitVendorChunkPlugin, type UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { InlineConfig } from 'vitest'

interface VitestConfigExport extends UserConfig {
  test: InlineConfig
}

const testConfig = {
  globals: true,
  clearMocks: true,
  setupFiles: ['./client/src/setupTests.ts', 'dotenv/config'],
  environment: 'jsdom',
  alias: {
    '@utils/test': new URL(
      './client/src/utils/testWrapper.tsx',
      import.meta.url,
    ).pathname,
  },
  coverage: {
    provider: 'v8',
    include: ['client/src/**/*', 'serverless/**/*'],
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
      'serverless/generated',
      'serverless/**/*.generated.ts',
    ],
    all: true,
    branches: 40,
    functions: 50,
    lines: 50,
    statements: 50,
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
