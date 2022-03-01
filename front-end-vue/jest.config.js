module.exports = {
    preset: "ts-jest/presets/default-esm",
    moduleFileExtensions: ["js", "ts", "vue"],
    transform: {
        "^.+\\.vue$": "vue3-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
        "^.+\\.(ts|tsx)$": "babel-jest"
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
    globals: {
        "vue3-jest": {babelConfig: true},
        'ts-jest': {useESM: true},
    },
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
        "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
        "^@/(.*)$": "<rootDir>/src/$1"
    }
};
