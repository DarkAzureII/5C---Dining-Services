import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            provider: 'v8', // or 'v8', but 'c8' is preferred
            reporter: ['text', 'json', 'html'], // Specify desired formats (text, json, html)
            include: ['src/**/*.{ts,tsx}'], // Files you want to include in coverage
            exclude: ['node_modules', 'dist'], // Exclude unnecessary directories/files
          },
    }
})