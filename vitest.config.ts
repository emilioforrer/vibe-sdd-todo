import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/**/*.{test,spec}.ts'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['components/**', 'composables/**', 'pages/**', 'types/**', 'app.vue'],
      exclude: ['**/*.d.ts', 'tests/**'],
    },
  },
})
