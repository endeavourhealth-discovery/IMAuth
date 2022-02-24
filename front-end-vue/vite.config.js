import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const path = require("path");
import { esbuildCommonjs } from "@originjs/vite-plugin-commonjs";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    dedupe: ["vue"],
    alias: { "@": path.resolve(__dirname, "./src") }
  },
  define: { global: {} }
});
