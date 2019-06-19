// Sh**t! I Smoke
// Copyright (C) 2018-2019  Marcelo S. Coelho, Amaury Martiny

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import React, { PureComponent } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';

import cigarette from '../../../../assets/images/cigarette.png';
import { i18n } from '../../../localization';
import * as theme from '../../../utils/theme';

export class Box extends PureComponent {
  render () {
    return (
      <View style={styles.box}>
        <View style={styles.equivalence}>
          <View style={styles.statisticsLeft}>
            <Image source={cigarette} style={styles.cigarette} />
            <Text style={styles.value} />
            <Text style={styles.label}>{i18n.t('about_box_per_day')}</Text>
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
          {i18n.t('about_box_footnote')}
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
    left: 6,
    position: 'absolute',
    bottom: 12
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
