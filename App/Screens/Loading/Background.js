// Copyright (c) 2018-2019, Amaury Martiny
// SPDX-License-Identifier: GPL-3.0

import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import * as theme from '../../utils/theme';

export class Background extends PureComponent {
  render () {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: theme.iconBackgroundColor,
    flexGrow: 1,
    justifyContent: 'center'
  }
});
