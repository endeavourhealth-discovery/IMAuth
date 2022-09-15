import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
const path = require("path");

export default defineConfig({
  base: "./",
  plugins: [vue()],
  resolve: {
    dedupe: ["vue"],
    alias: { "./runtimeConfig": "./runtimeConfig.browser", "@": path.resolve(__dirname, "./src") }
  },
  test: {
    globals: true,
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "http://localhost"
      }
    },
    coverage: {
      reporter: ["text", "lcov"]
    },
    setupFiles: "./tests/setupTests.js"
  }
});
