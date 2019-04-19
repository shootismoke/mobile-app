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

import axios from 'axios';

import { aqiToRaw } from './utils/aqiToRaw';

/**
 * Fetch the PM2.5 level from https://wind.waqi.info.
 */
export const windWaqi = async ({ latitude, longitude }) => {
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

    if (data.pol !== 'pm25') {
      throw new Error('PM2.5 not defined in response.');
    }

    return {
      aqi: +data.v,
      attributions: [],
      city: { geo: [+data.geo[0], +data.geo[1]], name: data.nlo },
      dominentpol: data.pol,
      iaqi: {
        [data.pol]: {
          v: +data.v
        }
      },
      idx: +data.x,
      rawPm25: aqiToRaw.pm25(+data.v),
      time: {
        v: data.t
      }
    };
  } else {
    throw new Error(response);
  }
};
