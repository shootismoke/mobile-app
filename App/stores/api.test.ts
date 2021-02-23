// Sh**t! I Smoke
// Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.

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

import { withTimeout } from './api';

describe('withTimeout', () => {
	it('should correct time out', async (done) => {
		jest.setTimeout(5000);

		const p = new Promise((resolve) => setTimeout(resolve, 2001));

		try {
			await withTimeout(p, 2000);

			done.fail();
		} catch (e) {
			done();
		}
	});
});
