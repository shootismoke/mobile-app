// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import axios from 'axios';
import { Constants } from 'expo';
import haversine from 'haversine';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BackButton } from '../../../components/BackButton';
import changeLocation from '../../../../assets/images/changeLocation.png';
import { CurrentLocation } from '../../../components/CurrentLocation';
import { getCorrectLatLng } from '../../../utils/getCorrectLatLng';
import * as theme from '../../../utils/theme';

/**
 * Format date to hh:mm.
 *
 * @param {Date} date - The Date object to format.
 */
const hhmm = date => {
  const time = date
    .toISOString()
    .split('T')[1] // Get
    .split('.')[0]
    .split(':');

  return `${time[0]}:${time[1]}`;
};

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export class Header extends Component {
  static defaultProps = {
    showChangeLocation: false
  };

  render() {
    const { api, currentLocation, onBackClick } = this.props;

    const lastUpdated =
      api && api.debug && api.debug.sync ? new Date(api.debug.sync) : null;
    const { dominantpol } = api;
    const { no2, o3, pm10, pm25 } = api.iaqi || {};

    return (
      <View style={styles.container}>
        <BackButton onClick={onBackClick} style={styles.backButton} />

        <View style={styles.content}>
          <Image source={changeLocation} style={styles.changeLocation} />

          <View>
            <CurrentLocation
              api={api}
              currentLocation={currentLocation}
              style={styles.currentLocation}
            />
            {lastUpdated &&
              this.renderInfo(
                'Latest Update:',
                `${weekdays[lastUpdated.getDay()]} ${hhmm(lastUpdated)}`
              )}
            {dominantpol &&
              this.renderInfo('Primary pollutant:', dominantpol.toUpperCase())}

            <View style={styles.pollutants}>
              {pm25 &&
                this.renderInfo('PM2.5 AQI:', pm25.v, styles.pollutantItem)}
              {o3 && this.renderInfo('O3 AQI:', o3.v, styles.pollutantItem)}
              {pm10 &&
                this.renderInfo('PM2.5 AQI:', pm10.v, styles.pollutantItem)}
              {no2 && this.renderInfo('NO2 AQI:', no2.v, styles.pollutantItem)}
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderInfo = (label, value, style = null) => {
    return (
      <Text style={[styles.info, style]}>
        <Text style={styles.label}>{label}</Text> {value}
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: theme.defaultSpacing
  },
  changeLocation: {
    marginRight: 5
  },
  container: {
    ...theme.elevatedLevel1,
    ...theme.withPadding,
    paddingBottom: 15,
    paddingTop: theme.defaultSpacing
  },
  content: {
    flexDirection: 'row'
  },
  currentLocation: {
    marginBottom: theme.defaultSpacing
  },
  info: {
    ...theme.text,
    marginVertical: 2
  },
  label: {
    color: theme.primaryColor,
    fontFamily: theme.boldFont
  },
  pollutantItem: {
    flexBasis: '34%'
  },
  pollutants: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.defaultSpacing
  },
  title: {
    ...theme.title,
    fontSize: 15
  }
});
