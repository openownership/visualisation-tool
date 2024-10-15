/** @type {import('jest').Config} */
export default {
  collectCoverage: false,
  collectCoverageFrom: ['**/src/**'],
  verbose: true,
  moduleNameMapper: {
    '\\.(css|sass|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
    d3: '<rootDir>/node_modules/d3/dist/d3.min.js',
  },
  setupFilesAfterEnv: ['jest-extended/all'],
};
