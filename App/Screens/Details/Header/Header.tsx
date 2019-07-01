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
import { formatRelative } from 'date-fns';
import { Image, StyleSheet, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';

import locationIcon from '../../../../assets/images/location.png';
import { BackButton } from '../../../components/BackButton';
import { CurrentLocation } from '../../../components/CurrentLocation';
import { i18n } from '../../../localization';
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
                i18n.t('details_header_latest_update_label'),
                formatRelative(lastUpdated, new Date())
              )}
            {dominentpol &&
              this.renderInfo(i18n.t('details_header_primary_pollutant_label'), dominentpol.toUpperCase())}

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
