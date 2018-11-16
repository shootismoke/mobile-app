// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import haversine from 'haversine';
import { StyleSheet, Text } from 'react-native';

import { Banner } from '../../../components/Banner';
import { getCorrectLatLng } from '../../../utils/getCorrectLatLng';
import * as theme from '../../../utils/theme';

export class Distance extends Component {
  render() {
    const { api, currentLocation } = this.props;
    const distance = Math.round(
      haversine(
        currentLocation,
        getCorrectLatLng(currentLocation, {
          latitude: api.city.geo[0],
          longitude: api.city.geo[1]
        })
      )
    );

    return (
      <Banner elevated="very" style={styles.banner}>
        <Text style={styles.distance}>AQI STATION: {distance}KM AWAY</Text>
      </Banner>
    );
  }
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  distance: {
    ...theme.title,
    color: 'white'
  }
});
