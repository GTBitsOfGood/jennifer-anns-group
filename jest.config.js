const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: "./",
});


const config = {

  preset: "@shelf/jest-mongodb",
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};

module.exports = createJestConfig(config);