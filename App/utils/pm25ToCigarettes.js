// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

/**
 * Convert pm25 level to number of cigarettes
 * @see http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
 * @param {Float} api - The api object returned by the WAQI api.
 */
const pm25ToCigarettes = api => {
  const pm25 = api.aqi;
  // pm25 = 22 is equivalent to 1 cigarette per day
  const cigarettes = pm25 / 22;
  // Format to 1 decimal
  return Math.round(cigarettes * 10) / 10;
};

export default pm25ToCigarettes;
