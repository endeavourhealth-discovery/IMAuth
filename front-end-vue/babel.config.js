module.exports = {
sourceType: "module",
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: "2",
        targets: { node: "current" }
      }
    ],
    "@babel/preset-typescript",
    "@babel/preset-flow"
  ],
  plugins: [
    function() {
      return {
        visitor: {
          MetaProperty(path) {
            path.replaceWithSourceString("process");
          }
        }
      };
    }
  ]
};
