// Copyright (c) 2018, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

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
