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
        'serverless/setup-server-tests.ts',
      ],
      all: true,
      branches: 30, // 40
      functions: 40, // 50
      lines: 50,
      statements: 50,
      cleanOnRerun: false,
    },
  },
} satisfies VitestConfigExport

export default defineConfig(viteConfig)
