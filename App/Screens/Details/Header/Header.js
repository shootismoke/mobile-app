// Copyright (c) 2018-2019, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { formatRelative } from 'date-fns';
import { Image, StyleSheet, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';

import { BackButton } from '../../../components/BackButton';
import locationIcon from '../../../../assets/images/location.png';
import { CurrentLocation } from '../../../components/CurrentLocation';
import * as theme from '../../../utils/theme';

const trackedPollutant = ['pm25', 'pm10', 'co', 'o3', 'no2', 'so2'];

@inject('stores')
@observer
export class Header extends Component {
  render () {
    const {
      onBackClick,
      stores: { api }
    } = this.props;

    const lastUpdated =
      api.time && api.time.v ? new Date(api.time.v * 1000) : null;
    const { dominentpol, iaqi } = api;

    return (
      <View style={styles.container}>
        <BackButton onClick={onBackClick} style={styles.backButton} />

        <View style={styles.layout}>
          <Image source={locationIcon} style={styles.changeLocation} />

          <View style={styles.content}>
            <CurrentLocation style={styles.currentLocation} />
            {lastUpdated &&
              this.renderInfo(
                'Latest Update:',
                formatRelative(lastUpdated, new Date())
              )}
            {dominentpol &&
              this.renderInfo('Primary pollutant:', dominentpol.toUpperCase())}

            <View style={styles.pollutants}>
              {trackedPollutant.map(
                pollutant =>
                  iaqi.get(pollutant) &&
                  this.renderInfo(
                    `${pollutant.toUpperCase()} AQI:`,
                    iaqi.get(pollutant).v,
                    styles.pollutantItem
                  )
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderInfo = (label, value, style = null) => {
    return (
      <Text key={label} style={[styles.info, style]}>
        <Text style={styles.label}>{label}</Text> {value}
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: theme.spacing.normal
  },
  changeLocation: {
    marginRight: theme.spacing.normal
  },
  container: {
    ...theme.elevatedLevel1('bottom'),
    ...theme.withPadding,
    backgroundColor: 'white',
    paddingBottom: 15,
    paddingTop: theme.spacing.normal,
    zIndex: 1
  },
  content: {
    flex: 1
  },
  currentLocation: {
    marginBottom: theme.spacing.normal
  },
  info: {
    ...theme.text,
    marginVertical: 5
  },
  label: {
    color: theme.primaryColor,
    fontFamily: theme.boldFont
  },
  layout: {
    flexDirection: 'row'
  },
  pollutantItem: {
    flexBasis: '45%'
  },
  pollutants: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.normal
  }
});
