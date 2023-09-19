import react from '@vitejs/plugin-react'
import { defineConfig, splitVendorChunkPlugin, type UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { InlineConfig } from 'vitest'

interface VitestConfigExport extends UserConfig {
  test: InlineConfig
}

const testConfig = {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./client/src/setupTests.ts'],
  alias: {
    '@utils/test': new URL(
      './client/src/utils/testWrapper.tsx',
      import.meta.url,
    ).pathname,
  },
  coverage: {
    provider: 'v8',
    include: ['client/src/**/*'],
    reporter: ['text', 'json', 'html'],
    exclude: [
      'client/src/colorPalette.ts',
      'client/src/utils/testWrapper.ts',
      'client/src/utils/noop.ts',
      // TODO: after create the theme, remove this line
      'client/src/utils/theme.ts',
      'client/src/**/index.ts',
      'client/src/**/index.tsx',
      'client/src/**/*.d.ts',
      'client/src/**/mock.ts',
      'client/src/**/main.tsx',
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
