// Copyright (c) 2018, Amaury Martiny and the Sh*t! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

/**
 * Get GPS location as a Promise
 */
const getCurrentPosition = (options = {}) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

export default getCurrentPosition;
