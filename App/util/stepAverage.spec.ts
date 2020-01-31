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

import { subDays } from 'date-fns';

import { sumInDays } from './stepAverage';

describe('stepAverage', () => {
  it('should compute correct values', () => {
    const data = [
      { time: new Date(), value: 3 },
      { time: subDays(new Date(), 1), value: 2 },
      { time: subDays(new Date(), 2), value: 1 }
    ];

    // value=1 for 5 days => 5
    // value=2 for 1 day  => 2
    // value=3 for 1 day  => 3
    // Sum is 10
    expect(sumInDays(data, 'weekly').toFixed(2)).toBe('10.00');
  });
});
