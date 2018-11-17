// Copyright (c) 2018, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import changeLocation from '../../../../assets/images/changeLocation.png';
import { CurrentLocation } from '../../../components/CurrentLocation';
import * as theme from '../../../utils/theme';
import warning from '../../../../assets/images/warning.png';

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
                Air Quality Station: {distanceToStation}
                km away
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
