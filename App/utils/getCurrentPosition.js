// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

/**
 * Get GPS location as a Promise
 */
export const getCurrentPosition = (options = { timeout: 10000 }) =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
