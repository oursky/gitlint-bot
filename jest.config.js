module.exports = {
  roots: [
    "<rootDir>/packages/bot/src/",
    "<rootDir>/packages/lint/tests/",
    "<rootDir>/packages/lint/src/",
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.[tj]sx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
