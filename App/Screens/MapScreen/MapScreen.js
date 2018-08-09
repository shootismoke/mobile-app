// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { MapView } from 'expo';
import { StyleSheet, View } from 'react-native';

import getCorrectLatLng from '../../utils/getCorrectLatLng';
import Header from '../../Header';
import homeIcon from '../../../assets/images/home.png';
import SearchHeader from '../Search/SearchHeader';
import stationIcon from '../../../assets/images/station.png';
import * as theme from '../../utils/theme';
import truncate from 'truncate';

export default class MapScreen extends Component {
  static navigationOptions = {
    header: props => {
      return (
        <Header
          {...props.screenProps}
          elevated
          onBackClick={props.navigation.pop}
          showBackButton
          style={styles.header}
        />
      );
    }
  };

  state = {
    showMap: false
  };

  showMapTimeout = null;

  componentWillMount () {
    // Show map after 200ms for smoother screen transition
    setTimeout(() => this.setState({ showMap: true }), 500);
  }

  componentWillUnmount () {
    clearTimeout(this.showMapTimeout);
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
      screenProps: { api, currentLocation, onChangeLocationClick }
    } = this.props;
    const { showMap } = this.state;

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
        <SearchHeader
          asTouchable
          elevated='very'
          onClick={onChangeLocationClick}
          onPress={onChangeLocationClick}
          search=''
        />
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
                title='Air Quality Station'
                description={truncate(station.description, 40)}
              />
              <MapView.Marker
                color='blue'
                coordinate={currentLocation}
                image={homeIcon}
                title='Your position'
              />
            </MapView>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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
