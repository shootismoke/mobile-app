// Copyright (c) 2018-2019, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, Text } from 'react-native';

import { Banner } from '../../../components/Banner';
import { i18n } from '../../../localization';
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
          {i18n.t('details_distance_label', { distanceToStation }).toUpperCase()}
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
