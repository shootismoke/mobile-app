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

export type Pollutant = 'pm25'; // Only support this pollutant for now

function roundTo1Decimal(n: number) {
  return Math.round(10 * n) / 10;
}

/**
 * Pollutant AQI to raw concentration linear breakpoints.
 *
 * @see https://www3.epa.gov/airnow/aqi-technical-assistance-document-sept2018.pdf
 */
const breakPoints = {
  pm25: [
    [[0, 50], [0, 12]],
    [[51, 100], [12.1, 35.4]],
    [[101, 150], [35.5, 55.4]],
    [[151, 200], [55.5, 150.4]],
    [[201, 300], [150.5, 250.4]],
    [[301, 400], [250.5, 350.4]],
    [[401, 500], [350.5, 500]]
  ]
};

/**
 * Converts a pollutant AQI into the raw PM25 level, in ug/m3, following the
 * EPAstandard, using {@link breakpoints}
 *
 * @param {Float} pm25 - The PM25 AQI.
 * @see https://github.com/amaurymartiny/shoot-i-smoke/issues/46
 * @see https://www3.epa.gov/airnow/aqi-technical-assistance-document-sept2018.pdf
 */
function aqiToRawFormula(pollutant: 'pm25', aqi: number) {
  const segment = breakPoints[pollutant].find(
    ([[aqiLow, aqiHigh]]) => aqiLow <= aqi && aqi <= aqiHigh
  );

  if (!segment) {
    // For PM2.5 greater than 500, AQI is not officially defined, but since
    // such levels have been occurring throughout China in recent years, one of
    // two conventions is used. Either the AQI is defined as equal to PM2.5 (in
    // micrograms per cubic meter) or the AQI is simply set at 500.
    // We take the 1st convention here.
    return aqi;
  }

  const [[aqiLow, aqiHigh], [rawLow, rawHigh]] = segment;
  return roundTo1Decimal(
    // Use 1 decimal place as per the pdf
    ((aqi - aqiLow) / (aqiHigh - aqiLow)) * (rawHigh - rawLow) + rawLow
  );
}

// For now we only track pm25 converions
const pollutants = ['pm25'] as Pollutant[];

export const aqiToRaw: { [index: string]: (aqi: number) => number } = {};

pollutants.forEach(pollutant => {
  aqiToRaw[pollutant] = aqi => aqiToRawFormula(pollutant, aqi);
});
