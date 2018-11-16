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

    return (
      <View style={styles.container}>
        <BackButton onClick={onBackClick} style={styles.backButton} />

        <View style={styles.content}>
          <TouchableOpacity onPress={onChangeLocationClick}>
            <Image source={changeLocation} style={styles.changeLocation} />
          </TouchableOpacity>

          <View>
            <CurrentLocation api={api} currentLocation={currentLocation} />
            {lastUpdated && (
              <Text style={styles.subtitle}>
                Latest Update: {lastUpdated.getDay()} {lastUpdated.getHours()}:
                {lastUpdated.getMinutes()}
              </Text>
            )}
          </View>
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
    ...theme.elevatedLevel1,
    ...theme.withPadding,
    paddingBottom: 15,
    paddingTop: theme.defaultSpacing
  },
  content: {
    flexDirection: 'row'
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
