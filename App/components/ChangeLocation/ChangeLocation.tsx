// Sh**t! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

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
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';
import { scale } from 'react-native-size-matters';

import changeLocation from '../../../assets/images/changeLocation.png';
import { i18n } from '../../localization';
import * as theme from '../../util/theme';

type ChangeLocationProps = TouchableOpacityProps;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: scale(60)
  },
  icon: {
    alignSelf: 'center',
    marginBottom: theme.spacing.tiny
  },
  label: {
    ...theme.withLetterSpacing,
    color: theme.primaryColor,
    fontFamily: theme.gothamBlack,
    fontSize: scale(7),
    lineHeight: scale(10),
    textAlign: 'center',
    textTransform: 'uppercase'
  }
});

export function ChangeLocation(props: ChangeLocationProps): React.ReactElement {
  const { onPress, ...rest } = props;

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} {...rest}>
      <Image source={changeLocation} style={styles.icon} />
      <Text style={styles.label}>{i18n.t('home_header_change_location')}</Text>
    </TouchableOpacity>
  );
}
