import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure the output directory is 'dist'
    rollupOptions: {
      input: '/src/main.tsx', // Ensure this points to your entry file
    },
  },
  base: '/', // Adjust if you're deploying to a subdirectory
})
