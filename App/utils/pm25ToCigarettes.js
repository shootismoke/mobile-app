// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

/**
 * Convert pm25 level to number of cigarettes. 1 cigarette is equivalent of a
 * PM2.5 level of 22ug/m3.
 *
 * @see http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
 * @param {Float} api - The api object returned by the WAQI api.
 */
const pm25ToCigarettes = pm25 => pm25 / 22;

export default pm25ToCigarettes;
