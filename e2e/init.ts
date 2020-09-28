// Sh**t! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import { cleanup, init } from 'detox';
import adapter from 'detox/runners/jest/adapter';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const config = require('../package.json').detox;

jest.setTimeout(30 * 60 * 1000); // 30 minutes timeout
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
jasmine.getEnv().addReporter(adapter);

beforeAll(async () => {
	await init(config);
});

beforeEach(async () => {
	await adapter.beforeEach();
});

afterAll(async () => {
	await adapter.afterAll();
	await cleanup();
});
