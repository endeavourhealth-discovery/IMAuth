import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: "./",
  plugins: [vue()],
  resolve: {
    dedupe: ["vue"],
    alias: { "./runtimeConfig": "./runtimeConfig.browser", "@": fileURLToPath(new URL('src', import.meta.url)) }
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
    }
  }
});
