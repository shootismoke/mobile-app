// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import axios from 'axios';

/**
 * Fetch the PM2.5 level from https://wind.waqi.info.
 * @return {number} - The PM2.5 level.
 */
const windWaqi = async ({ latitude, longitude }) => {
  const { data: response } = await axios.get(
    `https://wind.waqi.info/mapq/nearest?geo=1/${latitude}/${longitude}`,
    { timeout: 6000 }
  );

  // Example response:
  // Object {
  //   "d": Array [
  //     Object {
  //       "d": 0.8,
  //       "geo": Array [
  //         52.489451,
  //         13.430844,
  //       ],
  //       "key": "_c08tyk3Mq9R3Si3KyczT90stzT68LScnT9cvMa84Na-4pCjx8PxUAA",
  //       "nlo": "Neukölln-Nansenstraße, Berlin",
  //       "nna": "",
  //       "pol": "pm25",
  //       "t": 1533819600,
  //       "u": "Germany/Berlin/Neukölln-Nansenstraße",
  //       "v": "75",
  //       "x": "10032",
  //     },
  //   ],
  //   "g": null,
  // }

  if (response.d && response.d.length) {
    const data = response.d[0];
    return { pm25: data.v, city: { geo: data.geo, name: data.nlo } };
  } else {
    throw new Error(response);
  }
};

export default windWaqi;
