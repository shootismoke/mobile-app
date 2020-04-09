import { cleanup, init } from 'detox';
import adapter from 'detox/runners/jest/adapter';

const config = require('../package.json').detox;

jest.setTimeout(120000);
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
jasmine.getEnv().addReporter(adapter);

beforeAll(async () => {
  await init(config, { initGlobals: false });
});

beforeEach(async () => {
  await adapter.beforeEach();
});

afterAll(async () => {
  await adapter.afterAll();
  await cleanup();
});
