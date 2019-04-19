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
import { MapView } from 'expo';
import { StyleSheet, View } from 'react-native';
import truncate from 'truncate';

import homeIcon from '../../../assets/images/home.png';
import stationIcon from '../../../assets/images/station.png';
import { Distance } from './Distance';
import { Header } from './Header';
import { i18n } from '../../localization';
import { getCorrectLatLng } from '../../utils/getCorrectLatLng';
import * as theme from '../../utils/theme';

@inject('stores')
@observer
export class Details extends Component {
  state = {
    showMap: false
  };

  componentDidMount () {
    // Show map after 200ms for smoother screen transition
    setTimeout(() => this.setState({ showMap: true }), 500);
  }

  handleMapReady = () => {
    this.stationMarker &&
      this.stationMarker.showCallout &&
      this.stationMarker.showCallout();
  };

  handleStationRef = ref => {
    this.stationMarker = ref;
  };

  render () {
    const {
      navigation,
      stores: { api, location }
    } = this.props;
    const { showMap } = this.state;

    // TODO
    // I have no idea why, but if we don't clone the object, and continue to
    // use `location.current` everywhere, we get a `setting key of frozen
    // object` error. It's related to the MapView below.
    const currentLocation = { ...location.current };

    const station = {
      description:
        api.attributions && api.attributions.length
          ? api.attributions[0].name
          : null,
      title: api.city.name,
      ...getCorrectLatLng(currentLocation, {
        latitude: api.city.geo[0],
        longitude: api.city.geo[1]
      })
    };

    return (
      <View style={styles.container}>
        <Header onBackClick={navigation.pop} style={styles.header} />
        <View style={styles.mapContainer}>
          {showMap && (
            <MapView
              initialRegion={{
                latitude: (currentLocation.latitude + station.latitude) / 2,
                latitudeDelta:
                  Math.abs(currentLocation.latitude - station.latitude) * 2,
                longitude: (currentLocation.longitude + station.longitude) / 2,
                longitudeDelta:
                  Math.abs(currentLocation.longitude - station.longitude) * 2
              }}
              onMapReady={this.handleMapReady}
              style={styles.map}
            >
              <MapView.Marker
                color={theme.primaryColor}
                coordinate={station}
                image={stationIcon}
                ref={this.handleStationRef}
                title={i18n.t('details_air_quality_station_marker')}
                description={truncate(station.description, 40)}
              />
              <MapView.Marker
                color='blue'
                coordinate={currentLocation}
                image={homeIcon}
                title={i18n.t('details_your_position_marker')}
              />
            </MapView>
          )}
        </View>
        <Distance />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  header: {
    backgroundColor: theme.backgroundColor
  },
  map: {
    flexGrow: 1
  },
  mapContainer: {
    flexGrow: 1
  }
});
