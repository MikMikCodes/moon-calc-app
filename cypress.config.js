const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // ✅ this goes here
    setupNodeEvents(on, config) {
      // optional: for plugins or event handling
    },
  },
});
