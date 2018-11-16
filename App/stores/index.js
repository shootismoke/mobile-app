// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import haversine from 'haversine';
import { types } from 'mobx-state-tree';

import { ApiStore } from './api';
import { getCorrectLatLng } from '../utils/getCorrectLatLng';
import { LocationStore } from './location';

export const RootStore = types
  .model('RootStore', {
    api: ApiStore,
    location: LocationStore
  })
  .views(self => ({
    get distanceToStation() {
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
  .actions(self => ({
    setApi(api) {
      self.api = api;
    }
  }));
