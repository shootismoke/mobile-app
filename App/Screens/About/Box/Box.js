// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import React, { Component } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';

import cigarette from '../../../../assets/images/cigarette.png';
import * as theme from '../../../utils/theme';

export class Box extends Component {
  render() {
    return (
      <View style={styles.box}>
        <View style={styles.equivalence}>
          <View style={styles.statisticsLeft}>
            <Image source={cigarette} style={styles.cigarette} />
            <Text style={styles.value} />
            <Text style={styles.label}>per day</Text>
          </View>
          <Text style={styles.equal}>=</Text>
          <View style={styles.statisticsRight}>
            <Text style={styles.value}>22</Text>
            <Text style={styles.label}>
              <Text style={styles.micro}>&micro;</Text>
              g/m&sup3; PM2.5*
            </Text>
          </View>
        </View>
        <Text style={styles.boxDescription}>
          *Atmospheric particulate matter (PM) that have a diameter of less than
          2.5 micrometers, with increased chances of inhalation by living
          beings.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    borderColor: '#EAEAEA',
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'white',
    marginTop: 20,
    marginBottom: 10,
    padding: 10
  },
  boxDescription: {
    ...theme.text,
    fontSize: 9,
    lineHeight: 16,
    marginTop: 15
  },
  cigarette: {
    left: 16,
    position: 'absolute'
  },
  equal: {
    ...theme.text,
    color: theme.secondaryTextColor,
    fontSize: 44,
    lineHeight: 44,
    marginHorizontal: 18
  },
  equivalence: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  label: {
    ...theme.title,
    color: theme.secondaryTextColor,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  micro: {
    ...Platform.select({
      ios: {
        fontFamily: 'Georgia'
      },
      android: {
        fontFamily: 'normal'
      }
    })
  },
  statisticsLeft: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: 36,
    paddingRight: 10,
    width: 90
  },
  statisticsRight: {
    alignItems: 'center',
    width: 90
  },
  value: {
    ...theme.text,
    color: theme.secondaryTextColor,
    fontSize: 44,
    lineHeight: 44
  }
});
