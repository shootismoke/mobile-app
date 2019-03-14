// Copyright (c) 2018-2019, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

/**
 * Convert pm25 level to number of cigarettes. 1 cigarette is equivalent of a
 * PM2.5 level of 22ug/m3.
 *
 * @see http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
 * @param {Float} api - The api object returned by the WAQI api.
 */
export const pm25ToCigarettes = rawPm25 => rawPm25 / 22;
