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
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import { scale } from 'react-native-size-matters';

import * as theme from '../../util/theme';

interface BoxButtonProps {
  children: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}

export function BoxButton (props: BoxButtonProps) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.boxButton, props.style]}
    >
      <Text style={theme.shitText}>{props.children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boxButton: {
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: scale(12),
    borderWidth: 1,
    elevation: 1,
    padding: theme.spacing.tiny,
    ...theme.elevatedLevel2('bottom')
    // shadowColor: 'black',
    // shadowOffset: { width: 20, height: 20 },
    // shadowOpacity: 0.1,
    // shadowRadius: 20
  }
});
