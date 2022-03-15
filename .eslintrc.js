module.exports = {
  root: true,

  env: {
    es2021: true
  },

  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
    "plugin:cypress/recommended",
    "@vue/typescript"
  ],

  plugins: ["prettier"],

  ignorePatterns: ["src/discovery-syntax/*", "tests/*"],

  rules: {
    "no-console": import.meta.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": import.meta.env.NODE_ENV === "production" ? "warn" : "off",
    "no-use-before-define": import.meta.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": import.meta.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-explicit-any": "off",
    "vue/multi-word-component-names": "off"
  }
};
