import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  moduleNameMapper: {
    '^.+.(css|less|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
};

export default config;
