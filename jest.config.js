const cwd = process.cwd();

/** @type {import('jest').Config} */
export default {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/mocks/**',
  ],
  coveragePathIgnorePatterns: [],
  setupFilesAfterEnv: ['<rootDir>/config/jest/setupTests.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['node_modules'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'jest-chain-transform',
      {
        transformers: [
          `${cwd}/config/jest/importMetaTransform.cjs`,
          '@swc/jest',
        ],
      },
    ],
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.cjs',
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    '^.+\\.module\\.(css|sass|scss)$',
    'node_modules/(?!(.*@commaai.*)/)',
  ],
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
};
