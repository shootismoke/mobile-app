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

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacityProps } from 'react-native';
import { scale } from 'react-native-size-matters';

import * as theme from '../../util/theme';
import { Button } from '../Button';

interface CircleButtonProps extends TouchableOpacityProps {
  icon?: string;
  text?: string;
}

const styles = StyleSheet.create({
  circle: {
    height: scale(36),

    paddingVertical: 0,
    width: scale(36)
  },
  label: {
    letterSpacing: 0,
    fontSize: scale(9),
    lineHeight: scale(10),
    marginTop: 0
  },
  withIcon: {
    // Empirical offset to make icons look more centered
    paddingLeft: scale(3),
    paddingTop: scale(3)
  }
});

export function CircleButton(props: CircleButtonProps): React.ReactElement {
  const { icon, style, text, ...rest } = props;

  return (
    <Button style={[styles.circle, icon && styles.withIcon, style]} {...rest}>
      {icon ? (
        <Ionicons color={theme.primaryColor} name={icon} size={28} />
      ) : (
        text && <Text style={styles.label}>{text}</Text>
      )}
    </Button>
  );
}
