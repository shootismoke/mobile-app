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

import haversine from 'haversine';
import { types } from 'mobx-state-tree';

import { ApiStore } from './api';
import { ErrorStore } from './error';
import { getCorrectLatLng } from '../utils/getCorrectLatLng';
import { LocationStore } from './location';
import { pm25ToCigarettes } from '../utils/pm25ToCigarettes';

// Above this distance (km), we consider the station too far from the user
export const MAX_DISTANCE_TO_STATION = 10;

export const RootStore = types
  .model('RootStore', {
    api: ApiStore,
    error: ErrorStore,
    location: LocationStore
  })
  .views(self => ({
    get cigarettes () {
      if (!self.api) {
        return 0;
      }
      return pm25ToCigarettes(self.api.rawPm25);
    },
    get distanceToStation () {
      if (!self.api || !self.location.current) {
        return 0;
      }

      return Math.round(
        haversine(
          self.location.current,
          getCorrectLatLng(self.location.current, {
            latitude: self.api.city.geo[0],
            longitude: self.api.city.geo[1]
          })
        )
      );
    }
  }))
  .views(self => ({
    get isStationTooFar () {
      return self.distanceToStation > MAX_DISTANCE_TO_STATION;
    }
  }))
  .actions(self => ({
    setApi (newApi) {
      self.api = newApi;
    },
    setError (newError) {
      // TODO Add sentry
      // https://github.com/amaurymartiny/shoot-i-smoke/issues/22
      self.error = newError;
    },
    reloadApp () {
      // This will reload the app
      self.location.setCurrent();
    }
  }));
