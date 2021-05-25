module.exports = {
  testMatch: ["**/*.unit.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  moduleNameMapper: {
    "@serverlesscdk/(.*)": "<rootDir>/packages/$1",
  },
};
