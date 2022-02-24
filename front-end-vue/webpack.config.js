// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  entry: "./main.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js"
  }
};
