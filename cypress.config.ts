import { defineConfig } from "cypress";
import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config
    },
    supportFile: 'cypress/support/e2e.ts',
    baseUrl: 'http://localhost:5173',
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
