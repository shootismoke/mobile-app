// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BackButton } from '../../../components/BackButton';
import changeLocation from '../../../../assets/images/changeLocation.png';
import { CurrentLocation } from '../../../components/CurrentLocation';
import * as theme from '../../../utils/theme';

@inject('stores')
@observer
export class Header extends Component {
  render() {
    const {
      elevated,
      onBackClick,
      onChangeLocationClick,
      onClick,
      showBackButton,
      stores: { api, location, distanceToStation },
      style
    } = this.props;

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
            style={styles.currentLocation}
          >
            <CurrentLocation
              api={api}
              currentLocation={location.current}
              numberOfLines={2}
            />
            <Text style={styles.subtitle}>
              Distance to Air Quality Station: {distanceToStation}
              km
            </Text>
          </TouchableOpacity>

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
  currentLocation: {
    maxWidth: '80%'
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
