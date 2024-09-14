import { CoverageSummary } from 'istanbul-lib-coverage'
import nextJest from 'next/jest'
import 'jest'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/config/(.*)$': '<rootDir>/srconfig/$1',
    '^@/public/(.*)$': '<rootDir>/srcublic/$1',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/*.test.[jt]s?(x)'],
  collectCoverage: true,
  resetMocks: true,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = async () => ({
  ...(await createJestConfig(customJestConfig)()),
  transformIgnorePatterns: ['^.+\\.module\\.(css|sass|scss)$'],
})
