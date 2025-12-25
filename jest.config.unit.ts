import { Config } from 'jest';

const config: Config = {
  rootDir: './',
  testMatch: [
    '**/*.test.ts',
    '!**/*.infra-test.ts',
    '!**/*.e2e-test.ts',
    '!test/**/*.ts',
  ],
  transform: { '^.+\\.ts$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'node',
  verbose: true,
};

export default config;
