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

import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { scale } from 'react-native-size-matters';

import { i18n } from '../../localization';
import * as theme from '../../util/theme';

import changeLocation from '../../../assets/images/changeLocation.png';

interface ChangeLocationProps extends TouchableOpacityProps {

}

export function ChangeLocation (props: ChangeLocationProps) {
  const { onPress } = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <Image style={styles.icon} source={changeLocation} />
      <Text style={styles.label}>{i18n.t('home_header_change_location')}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'yellow',
    maxWidth: 60
  },

  icon: {
    alignSelf: 'center',
    marginBottom: scale(4)
  },

  label: {
    color: theme.primaryColor,
    fontFamily: theme.gothamBlack,
    fontSize: scale(7),
    lineHeight: scale(8),
    textAlign: 'center',
    textTransform: 'uppercase'
  }
});
