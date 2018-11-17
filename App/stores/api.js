// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import { types } from 'mobx-state-tree';

export const ApiStore = types.maybe(
  types.model('ApiStore', {
    aqi: types.number,
    attributions: types.array(
      types.model({
        name: types.string,
        url: types.maybe(types.string)
      })
    ),
    city: types.model({
      geo: types.array(types.number),
      name: types.string,
      url: types.maybe(types.string)
    }),
    dominentpol: types.string,
    iaqi: types.map(
      types.model({
        v: types.number
      })
    ),
    idx: types.number,
    rawPm25: types.number,
    time: types.model({
      s: types.maybe(types.string),
      tz: types.maybe(types.string),
      v: types.number
    })
  })
);
