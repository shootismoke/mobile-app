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
