// Copyright (c) 2018, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import { aqiToRaw } from './aqiToRaw';

function testConversion(pollutant, aqi, raw) {
  it(`should convert ${pollutant} AQI ${aqi} to ${raw}ug/m3`, () => {
    expect(Math.round(100 * aqiToRaw[pollutant](aqi)) / 100).toBe(raw);
  });
}

describe('aqiToRaw', () => {
  describe('pm25', () => {
    testConversion('pm25', 25, 6);
    testConversion('pm25', 75, 23.51);
    testConversion('pm25', 125, 45.25);
    testConversion('pm25', 175, 101.98);
    testConversion('pm25', 250, 199.95);
    testConversion('pm25', 350, 299.95);
    testConversion('pm25', 450, 424.69);
    testConversion('pm25', 550, 550);
  });
});
