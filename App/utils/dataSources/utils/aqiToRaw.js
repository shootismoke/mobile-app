// Copyright (c) 2018, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

/**
 * Inverse a linear function.
 */
function invLinear (aqiHigh, aqiLow, concHigh, concLow, aqi) {
  return ((aqi - aqiLow) / (aqiHigh - aqiLow)) * (concHigh - concLow) + concLow;
}

export const aqiToRaw = {
  /**
   * Converts a PM25 AQI into the raw PM25 level, in ug/m3, following the EPA
   * standard.
   *
   * @param {Float} pm25 - The PM25 AQI.
   * @see https://github.com/amaurymartiny/shoot-i-smoke/issues/46
   */
  pm25 (aqi) {
    if (aqi >= 0 && aqi <= 50) {
      return invLinear(50, 0, 12, 0, aqi);
    } else if (aqi > 50 && aqi <= 100) {
      return invLinear(100, 51, 35.4, 12.1, aqi);
    } else if (aqi > 100 && aqi <= 150) {
      return invLinear(150, 101, 55.4, 35.5, aqi);
    } else if (aqi > 150 && aqi <= 200) {
      return invLinear(200, 151, 150.4, 55.5, aqi);
    } else if (aqi > 200 && aqi <= 300) {
      return invLinear(300, 201, 250.4, 150.5, aqi);
    } else if (aqi > 300 && aqi <= 400) {
      return invLinear(400, 301, 350.4, 250.5, aqi);
    } else if (aqi > 400 && aqi <= 500) {
      return invLinear(500, 401, 500.4, 350.5, aqi);
    } else {
      // For PM2.5 greater than 500, AQI is not officially defined, but since
      // such levels have been occurring throughout China in recent years, one of
      // two conventions is used. Either the AQI is defined as equal to PM2.5 (in
      // micrograms per cubic meter) or the AQI is simply set at 500.
      // We take the 1st convention here.
      return aqi;
    }
  }
};
