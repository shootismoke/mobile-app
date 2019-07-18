module.exports = {
  env: {
    jest: true
  },
  extends: [
    'prettier',
    'prettier/standard',
    'prettier/@typescript-eslint',
    'semistandard'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // https://stackoverflow.com/questions/55280555/typescript-eslint-eslint-plugin-error-route-is-defined-but-never-used-no-un
    '@typescript-eslint/no-unused-vars': 'error',
    'no-unused-vars': 'off',
    'react/jsx-uses-react': 1,
    'react/jsx-uses-vars': 1
  }
};
