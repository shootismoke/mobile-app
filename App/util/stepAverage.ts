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

import { compareAsc, differenceInMilliseconds, subDays } from 'date-fns';

import { Frequency } from '../stores';

interface Data {
  time: Date;
  value: number;
}

/**
 * Calculate the integral of a step function (the base step on the `x` axis
 * is 1ms)
 *
 * @param data - The data to calculate the integral on
 */
function stepIntegral(data: Data[], start: Date): number {
  if (!data.length) {
    return 0;
  }

  const sortedData = data.slice().sort((a, b) => compareAsc(a.time, b.time));

  return sortedData.reduce(
    (sum, currentValue, index) =>
      sum +
      differenceInMilliseconds(
        currentValue.time,
        index === 0 ? start : sortedData[index - 1].time
      ) *
        currentValue.value,
    0
  );
}

/**
 * Calculate the sum of values of a step function, with a base step on the
 * `x` axis as 1 day
 *
 * @param data - The data to calculate the sum on
 */
export function sumInDays(data: Data[], frequency: Frequency): number {
  return (
    stepIntegral(data, subDays(Date.now(), frequency === 'monthly' ? 30 : 7)) /
    (24 * 3600 * 1000)
  );
}
