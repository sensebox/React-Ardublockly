import { defineConfig } from "cypress";
import { GenerateCtrfReport } from "cypress-ctrf-json-reporter";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      new GenerateCtrfReport({
        on,
      });
    },
    baseUrl: "http://localhost:3000",
  },
});
