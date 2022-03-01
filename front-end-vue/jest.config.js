module.exports = {
  preset: "ts-jest",
  moduleFileExtensions: ["js", "ts", "vue"],
  transform: {
    "^.+\\.vue$": "vue3-jest"
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!primevue|d3|d3-array|internmap|delaunator|robust-predicates)"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,vue,ts}",
    "!src/main.ts", // No need to cover bootstrap file
    "!src/aws-exports.js",
    "!**/@types/**",
    "!**/discovery-syntax/**",
    "!**/typings/**"
  ],
  globals: { "vue3-jest": { babelConfig: true } },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};
