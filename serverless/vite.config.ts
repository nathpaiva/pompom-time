import { defineConfig, type UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { InlineConfig } from 'vitest'
import { configDefaults } from 'vitest/config'

interface VitestConfigExport extends UserConfig {
  test: InlineConfig
}

const testConfig = {
  globals: true,
  clearMocks: true,
  setupFiles: ['dotenv/config'],
  environment: 'node',
  exclude: [...configDefaults.exclude, 'client'],
  coverage: {
    provider: 'v8',
    include: ['serverless/**/*'],
    reporter: ['text', 'json', 'html'],
    exclude: ['serverless/generated', 'serverless/**/*.generated.ts'],
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
  plugins: [tsconfigPaths()],
  server: {
    port: 4200,
    watch: {
      usePolling: true,
    },
  },
} satisfies VitestConfigExport

export default defineConfig(viteConfig)
