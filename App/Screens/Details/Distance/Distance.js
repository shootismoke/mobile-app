// Copyright (c) 2018, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, Text } from 'react-native';

import { Banner } from '../../../components/Banner';
import * as theme from '../../../utils/theme';

@inject('stores')
@observer
export class Distance extends Component {
  render () {
    const {
      stores: { distanceToStation }
    } = this.props;

    return (
      <Banner elevated shadowPosition='top' style={styles.banner}>
        <Text style={styles.distance}>
          AQI STATION: {distanceToStation}KM AWAY
        </Text>
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
