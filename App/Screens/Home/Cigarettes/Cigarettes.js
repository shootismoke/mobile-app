// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import Cigarette from './Cigarette';
import pm25ToCigarettes from '../../../utils/pm25ToCigarettes';

export default class Cigarettes extends Component {
  getSize = cigarettes => {
    if (cigarettes <= 1) return 'big';
    if (cigarettes <= 5) return 'big';
    if (cigarettes <= 14) return 'medium';
    return 'small';
  };

  render () {
    const { pm25, style } = this.props;
    const cigarettes = Math.min(pm25ToCigarettes(pm25), 63); // We don't show more than 63
    // const cigarettes = 0.9; // Can change values here for testing

    const count = Math.floor(cigarettes);
    const decimal = cigarettes - count;

    const diagonal = cigarettes <= 1;
    const vertical = cigarettes > 5;

    return (
      <View style={style}>
        <View style={styles.container}>
          {cigarettes > 1 && count >= 1
            ? Array.from(Array(count)).map((_, i) => (
              <View key={i}>
                <Cigarette
                  size={this.getSize(cigarettes)}
                  vertical={vertical}
                />
              </View>
            ))
            : null}
          {cigarettes === 1 || decimal > 0 ? (
            <Cigarette
              diagonal={diagonal}
              length={decimal || 1}
              size={this.getSize(cigarettes)}
              style={cigarettes <= 1 ? styles.single : undefined}
              vertical={vertical}
            />
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  single: { marginLeft: -20 } // Empiric
});
