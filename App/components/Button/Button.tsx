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

import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';
import { scale } from 'react-native-size-matters';

import * as theme from '../../util/theme';

interface ButtonProps extends TouchableOpacityProps {
  children: string;
  icon?: string;
  type?: 'primary' | 'secondary';
}

const styles = StyleSheet.create({
  bigButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.mini
  },
  bigButtonText: {
    ...theme.title,
    color: theme.primaryColor
  },
  icon: {
    marginRight: theme.spacing.mini
  },
  primary: {
    borderColor: theme.primaryColor,
    borderRadius: scale(24),
    borderWidth: scale(2)
  },
  secondary: {}
});

export function Button(props: ButtonProps): React.ReactElement {
  const { children, icon, onPress, style, type, ...rest } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.bigButton,
        type && type === 'secondary' ? styles.secondary : styles.primary,
        style
      ]}
      {...rest}
    >
      {icon && (
        <FontAwesome
          color={theme.primaryColor}
          name={icon}
          size={15}
          style={styles.icon}
        />
      )}
      <Text style={styles.bigButtonText}>{children}</Text>
    </TouchableOpacity>
  );
}
