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
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View
} from 'react-native';
import { scale } from 'react-native-size-matters';

import * as theme from '../../util/theme';

interface BoxButtonProps extends TouchableWithoutFeedbackProps {
  active?: boolean;
  children: string;
}

const styles = StyleSheet.create({
  activeText: {
    opacity: 1
  },
  boxButton: {
    ...theme.elevationShadowStyle(3),
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: scale(12),
    borderWidth: 1,
    marginBottom: theme.spacing.mini,
    paddingHorizontal: theme.spacing.small,
    paddingVertical: scale(4), // Padding for the shadow
    shadowOpacity: 0.1
  },
  boxButtonText: {
    ...theme.shitText,
    opacity: 0.3,
    textAlign: 'center'
  }
});

export function BoxButton(props: BoxButtonProps): React.ReactElement {
  const { active, children, onPress, style, ...rest } = props;

  return (
    <TouchableWithoutFeedback onPress={onPress} {...rest}>
      <View style={[styles.boxButton, style]}>
        <Text
          style={[styles.boxButtonText, active ? styles.activeText : undefined]}
        >
          {children}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
