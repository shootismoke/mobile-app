module.exports = {
  preset: 'jest-expo',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js' // https://github.com/facebook/react-native/issues/21075#issuecomment-441332894
  }
};
