module.exports = {
  preset: 'jest-expo',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
