// Sh**t! I Smoke
// Copyright (C) 2018-2019  Marcelo S. Coelho, Amaury Martiny

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

import { aqiToRaw } from './aqiToRaw';

function testConversion (pollutant, aqi, raw) {
  it(`should convert ${pollutant} AQI ${aqi} to ${raw}ug/m3`, () => {
    expect(aqiToRaw[pollutant](aqi)).toBe(raw);
  });
}

describe('aqiToRaw', () => {
  describe('pm25', () => {
    testConversion('pm25', 25, 6);
    testConversion('pm25', 75, 23.5);
    testConversion('pm25', 125, 45.2);
    testConversion('pm25', 175, 102);
    testConversion('pm25', 250, 199.9);
    testConversion('pm25', 350, 299.9);
    testConversion('pm25', 450, 424.5);
    testConversion('pm25', 550, 550);
  });
});
