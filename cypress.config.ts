import { defineConfig } from "cypress";
import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      codeCoverageTask(on, config);
      // include any other plugin code...

      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config
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
