import { defineConfig, type UserConfig } from 'vite'
import type { InlineConfig } from 'vitest'
import { configDefaults } from 'vitest/config'

interface VitestConfigExport extends UserConfig {
  test: InlineConfig
}

const viteConfig = {
  test: {
    globals: true,
    clearMocks: true,
    setupFiles: ['dotenv/config'],
    environment: 'node',
    exclude: [...configDefaults.exclude, 'client'],
    coverage: {
      provider: 'v8',
      include: ['serverless/**/*'],
      reporter: ['text', 'json', 'html'],
      exclude: [
        'serverless/generated',
        'serverless/**/*.generated.ts',
        'serverless/**/*.d.ts',
        'serverless/**/types.ts',
        'serverless/utils/cleanupDbAfterTest.ts',
        'serverless/**/index.ts',
        'serverless/setup-server-tests.ts',
        'serverless/functions/action-mid-test/*',
      ],
      all: true,
      branches: 80, // TODO: next PR add tests and back to 90
      functions: 80,
      lines: 90,
      statements: 90,
      cleanOnRerun: false,
    },
  },
} satisfies VitestConfigExport

export default defineConfig(viteConfig)
