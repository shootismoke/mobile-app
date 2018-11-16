// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import axios from 'axios';
import { Constants } from 'expo';
import haversine from 'haversine';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BackButton } from '../BackButton';
import changeLocation from '../../../assets/images/changeLocation.png';
import { CurrentLocation } from '../CurrentLocation';
import { getCorrectLatLng } from '../../utils/getCorrectLatLng';
import * as theme from '../../utils/theme';

export class Header extends Component {
  static defaultProps = {
    showChangeLocation: false
  };

  render() {
    const {
      api,
      currentLocation,
      elevated,
      onBackClick,
      onChangeLocationClick,
      onClick,
      showBackButton,
      showChangeLocation,
      style
    } = this.props;
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
      <View
        style={[
          styles.container,
          elevated ? theme.elevatedLevel1 : null,
          style
        ]}
      >
        {showBackButton && (
          <BackButton onClick={onBackClick} style={styles.backButton} />
        )}

        <View style={styles.content}>
          <TouchableOpacity
            disabled={!onClick}
            onPress={onClick}
            style={showChangeLocation ? { maxWidth: '80%' } : undefined}
          >
            <CurrentLocation
              api={api}
              currentLocation={currentLocation}
              numberOfLines={2}
            />
            <Text style={styles.subtitle}>
              Distance to Air Quality Station: {distance}
              km
            </Text>
          </TouchableOpacity>
          {showChangeLocation && (
            <TouchableOpacity onPress={onChangeLocationClick}>
              <Image source={changeLocation} style={styles.changeLocation} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 22
  },
  changeLocation: {
    marginRight: 5
  },
  container: {
    paddingBottom: 15,
    paddingHorizontal: 17,
    paddingTop: 18
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  subtitle: {
    ...theme.text,
    marginTop: 11
  },
  title: {
    ...theme.title,
    fontSize: 15
  }
});
