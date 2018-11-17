// Copyright (c) 2018, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { formatRelative } from 'date-fns';
import { Image, StyleSheet, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';

import { BackButton } from '../../../components/BackButton';
import changeLocation from '../../../../assets/images/changeLocation.png';
import { CurrentLocation } from '../../../components/CurrentLocation';
import * as theme from '../../../utils/theme';

@inject('stores')
@observer
export class Header extends Component {
  render() {
    const {
      onBackClick,
      stores: { api }
    } = this.props;

    const lastUpdated =
      api.time && api.time.v ? new Date(api.time.v * 1000) : null;
    const { dominentpol, iaqi } = api;
    const pm10 = iaqi.get('pm10');
    const pm25 = iaqi.get('pm25');
    const o3 = iaqi.get('o3');
    const no2 = iaqi.get('no2');

    return (
      <View style={styles.container}>
        <BackButton onClick={onBackClick} style={styles.backButton} />

        <View style={styles.content}>
          <Image source={changeLocation} style={styles.changeLocation} />

          <View>
            <CurrentLocation style={styles.currentLocation} />
            {lastUpdated &&
              this.renderInfo(
                'Latest Update:',
                formatRelative(lastUpdated, new Date())
              )}
            {dominentpol &&
              this.renderInfo('Primary pollutant:', dominentpol.toUpperCase())}

            <View style={styles.pollutants}>
              {pm25 &&
                this.renderInfo('PM25 AQI:', pm25.v, styles.pollutantItem)}
              {o3 && this.renderInfo('O3 AQI:', o3.v, styles.pollutantItem)}
              {pm10 &&
                this.renderInfo('PM10 AQI:', pm10.v, styles.pollutantItem)}
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
    marginRight: theme.defaultSpacing
  },
  container: {
    ...theme.elevatedLevel1('bottom'),
    ...theme.withPadding,
    backgroundColor: 'white',
    paddingBottom: 15,
    paddingTop: theme.defaultSpacing,
    zIndex: 1
  },
  content: {
    flexDirection: 'row'
  },
  currentLocation: {
    marginBottom: theme.defaultSpacing
  },
  info: {
    ...theme.text,
    marginVertical: 5
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
  }
});
