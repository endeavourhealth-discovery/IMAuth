import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
const path = require("path");

export default defineConfig({
  plugins: [vue()],
  resolve: {
    dedupe: ["vue"],
    alias: { "./runtimeConfig": "./runtimeConfig.browser", "@": path.resolve(__dirname, "./src") }
  },
  test: {
    globals: true,
    setupFiles: [resolve(__dirname, "tests/setupTests.js")],
    environment: "jsdom"
  }
});
