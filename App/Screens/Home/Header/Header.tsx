// Sh**t! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

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

import React, { useContext } from 'react';
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { scale } from 'react-native-size-matters';

import alert from '../../../../assets/images/alert.png';
import { ChangeLocation, CurrentLocation } from '../../../components';
import { i18n } from '../../../localization';
import { ApiContext, CurrentLocationContext } from '../../../stores';
import { useDistanceUnit } from '../../../stores/distanceUnit';
import { distanceToStation, isStationTooFar } from '../../../util/station';
import * as theme from '../../../util/theme';

interface HeaderProps {
  onChangeLocationClick: (event: GestureResponderEvent) => void;
}

const styles = StyleSheet.create({
  container: {
    ...theme.withPadding,
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: theme.spacing.normal
  },
  currentLocation: {
    flex: 1,
    marginRight: theme.spacing.mini
  },
  distance: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: theme.spacing.mini
  },
  distanceText: {
    ...theme.text,
    flex: 1
  },
  warning: {
    marginRight: theme.spacing.mini,
    marginTop: scale(-2) // FIXME We shouldn't need that, with `alignItems: 'center'` on .distance
  }
});

export function Header(props: HeaderProps): React.ReactElement {
  const { api } = useContext(ApiContext);
  const { currentLocation, isGps } = useContext(CurrentLocationContext);
  const { distanceUnit, localizedDistanceUnit } = useDistanceUnit();
  const { onChangeLocationClick } = props;

  const shortDistanceUnit = localizedDistanceUnit('short');

  if (!currentLocation) {
    throw new Error(
      'Home/Header/Header.tsx only convert `distanceToStation` when `currentLocation` is defined.'
    );
  } else if (!api) {
    throw new Error(
      'Home/Header/Header.tsx only convert `distanceToStation` when `api` is defined.'
    );
  }

  const distance = distanceToStation(currentLocation, api, distanceUnit);
  const isTooFar = isStationTooFar(currentLocation, api);

  return (
    <View style={styles.container}>
      <View style={styles.currentLocation}>
        <CurrentLocation
          api={api}
          currentLocation={currentLocation}
          numberOfLines={2}
        />
        <View style={styles.distance}>
          {isTooFar && <Image source={alert} style={styles.warning} />}
          <Text style={styles.distanceText}>
            {i18n.t('home_header_air_quality_station_distance', {
              distanceToStation: distance,
              distanceUnit: shortDistanceUnit
            })}{' '}
            {!isGps && i18n.t('home_header_from_search')}
          </Text>
        </View>
      </View>

      <ChangeLocation onPress={onChangeLocationClick} />
    </View>
  );
}
