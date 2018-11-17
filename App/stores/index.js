// Copyright (c) 2018, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import haversine from 'haversine';
import { types } from 'mobx-state-tree';

import { ApiStore } from './api';
import { ErrorStore } from './error';
import { getCorrectLatLng } from '../utils/getCorrectLatLng';
import { LocationStore } from './location';
import { pm25ToCigarettes } from '../utils/pm25ToCigarettes';

// Above this distance, we consider the station too far from the user
export const MAX_DISTANCE_TO_STATION = 15;

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
    }
  }));
