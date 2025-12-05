import { Config } from 'jest';

const config: Config = {
  rootDir: './',
  testMatch: ['**/*.e2e-test.ts'],
  transform: { '^.+\\.ts$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'node',
  verbose: true,
  //   setupFilesAfterEnv: ['<rootDir>/test/e2e.setup.ts'],
};

export default config;
