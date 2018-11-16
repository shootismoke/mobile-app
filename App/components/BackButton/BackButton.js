// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { PureComponent } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import backIcon from '../../../assets/images/back.png';
import * as theme from '../../utils/theme';

export class BackButton extends PureComponent {
  onClick = () => this.props.onClick();

  render() {
    const { style } = this.props;

    return (
      <View style={style}>
        <TouchableOpacity
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={this.onClick}
          style={styles.backButton}
        >
          <Image source={backIcon} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  backText: {
    ...theme.text,
    marginLeft: 9
  }
});
