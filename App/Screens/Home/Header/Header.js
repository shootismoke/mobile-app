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

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import changeLocation from '../../../../assets/images/changeLocation.png';
import warning from '../../../../assets/images/warning.png';
import { CurrentLocation } from '../../../components/CurrentLocation';
import { i18n } from '../../../localization';
import * as theme from '../../../utils/theme';

@inject('stores')
@observer
export class Header extends Component {
  render () {
    const {
      onChangeLocationClick,
      stores: { api, distanceToStation, isStationTooFar, location }
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.currentLocation}>
            <CurrentLocation
              api={api}
              currentLocation={location.current}
              numberOfLines={2}
            />
            <View style={styles.distance}>
              {isStationTooFar && (
                <Image source={warning} style={styles.warning} />
              )}
              <Text style={theme.text}>
                {i18n.t('home_header_air_quality_station_distance', { distanceToStation })}
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
    marginTop: 11
  },
  title: {
    ...theme.title,
    fontSize: 15
  },
  warning: {
    marginRight: theme.spacing.tiny
  }
});
