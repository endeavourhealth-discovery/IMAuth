import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
const path = require("path");

export default defineConfig({
  base: "./",
  plugins: [vue()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
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
    setupFiles: "./tests/setupTests.ts"
  },
  server: {
    port: 8082,
    proxy: {
      "/nodeapi": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: p => p.replace(/^\/nodeapi/, "")
      },
      "/imapi": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: p => p.replace(/^\/imapi/, "")
      }
    }
  }
});
