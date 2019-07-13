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
import { StyleSheet, View } from 'react-native';

import { BoxButton } from '../../../components';
import * as theme from '../../../util/theme';

const FREQUENCY = {
  daily: undefined,
  weekly: new Date(),
  monthly: new Date()
};
type Frequency = keyof typeof FREQUENCY;

interface FrequencyProps {
  onChangeFrequency: (frequency: Frequency) => void;
}

export function Frequency (props: FrequencyProps) {
  return (
    <View style={styles.container}>
      <BoxButton
        onPress={() => props.onChangeFrequency('daily')}
        style={styles.boxButton}
      >
        daily
      </BoxButton>
      <BoxButton style={styles.boxButton}>weekly</BoxButton>
      <BoxButton style={styles.boxButton}>monthly</BoxButton>
    </View>
  );
}

const styles = StyleSheet.create({
  boxButton: {
    marginRight: theme.spacing.tiny
  },
  container: {
    flexDirection: 'row',
    marginTop: theme.spacing.tiny
  }
});
