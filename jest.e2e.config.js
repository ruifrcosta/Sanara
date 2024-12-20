module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/e2e/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/helpers/setup.js'],
  globalSetup: '<rootDir>/src/tests/helpers/globalSetup.js',
  globalTeardown: '<rootDir>/src/tests/helpers/globalTeardown.js',
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Relatório de Testes E2E Sanara',
        outputPath: './reports/e2e-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true,
        sort: 'status'
      }
    ]
  ],
  verbose: true,
  testTimeout: 30000
}; 