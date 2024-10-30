import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './tests/setup.ts',
        coverage: {
            provider: 'v8', 
            reporter: ['text', 'json', 'html'], 
            include: ['src/**/*.{ts,tsx}'], 
            exclude: ['node_modules', 'dist'], 
          },
    }
})