// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import { types } from 'mobx-state-tree';

const pollutant = () =>
  types.maybe(
    types.model({
      v: types.number
    })
  );

export const ApiStore = types.maybe(
  types.model('ApiStore', {
    aqi: types.number,
    city: types.model({
      geo: types.array(types.number),
      name: types.string,
      url: types.string
    }),
    dominentpol: types.string,
    iaqi: types.model({
      h: pollutant(),
      no2: pollutant(),
      o3: pollutant(),
      p: pollutant(),
      pm10: pollutant(),
      pm25: pollutant(),
      so2: pollutant(),
      t: pollutant(),
      w: pollutant(),
      wg: pollutant()
    }),
    idx: types.number,
    rawPm25: types.number,
    time: types.model({
      s: types.maybe(types.string),
      tz: types.maybe(types.string),
      v: types.number
    })
  })
);
