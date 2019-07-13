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

import React, { useContext } from 'react';
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import changeLocation from '../../../../assets/images/changeLocation.png';
import warning from '../../../../assets/images/warning.png';
import { CurrentLocation } from '../../../components';
import { i18n } from '../../../localization';
import { ApiContext, CurrentLocationContext } from '../../../stores';
import { distanceToStation, isStationTooFar } from '../../../util/station';
import * as theme from '../../../util/theme';

interface HeaderProps {
  onChangeLocationClick: (event: GestureResponderEvent) => void;
}

export function Header (props: HeaderProps) {
  const { api } = useContext(ApiContext)!;
  const { currentLocation } = useContext(CurrentLocationContext);
  const { onChangeLocationClick } = props;

  const distance = distanceToStation(currentLocation!, api!);
  const isTooFar = isStationTooFar(currentLocation!, api!);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.currentLocation}>
          <CurrentLocation
            api={api!}
            currentLocation={currentLocation!}
            numberOfLines={2}
          />
          <View style={styles.distance}>
            {isTooFar && <Image source={warning} style={styles.warning} />}
            <Text style={theme.text}>
              {i18n.t('home_header_air_quality_station_distance', {
                distanceToStation: distance
              })}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={onChangeLocationClick}>
          <Image source={changeLocation} style={styles.changeLocation} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: theme.spacing.normal
  },
  changeLocation: {
    marginRight: theme.spacing.tiny
  },
  container: {
    padding: theme.spacing.normal
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  currentLocation: {
    maxWidth: '80%'
  },
  distance: {
    flexDirection: 'row',
    marginTop: theme.spacing.tiny
  },
  warning: {
    marginRight: theme.spacing.tiny
  }
});
