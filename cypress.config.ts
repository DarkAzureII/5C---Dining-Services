import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: 'cypress/support/e2e.ts',
    baseUrl: 'http://localhost:5173', // Your app's URL
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
