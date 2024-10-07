import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
    },
    environment: 'jsdom',
    browser: {
      provider: 'playwright',
      enabled: true,
      name: 'chromium',
    },
  },
});
