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

import React, { useRef, useState } from 'react';
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { BoxButton } from './BoxButton';
import * as theme from '../../../util/theme';

const FREQUENCY = {
  daily: undefined,
  weekly: new Date(),
  monthly: new Date()
};
export type Frequency = keyof typeof FREQUENCY;

interface SelectFrequencyProps {
  frequency: Frequency;
  onChangeFrequency: (frequency: Frequency) => void;
  style?: StyleProp<ViewStyle>;
}

export function SelectFrequency (props: SelectFrequencyProps) {
  const scroll = useRef<ScrollView>(null);
  const [dailyWidth, setDailyWidth] = useState(0); // Width of the daily button

  const { frequency, onChangeFrequency, style } = props;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      ref={scroll}
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
    >
      <BoxButton
        active={frequency === 'daily'}
        onLayout={event => setDailyWidth(event.nativeEvent.layout.width)}
        onPress={() => {
          scroll.current!.scrollTo({ x: 0 });
          onChangeFrequency('daily');
        }}
        style={styles.boxButton}
      >
        daily
      </BoxButton>
      <BoxButton
        active={frequency === 'weekly'}
        onPress={() => {
          scroll.current!.scrollTo({
            x: dailyWidth + theme.spacing.tiny
          });
          onChangeFrequency('weekly');
        }}
        style={styles.boxButton}
      >
        weekly
      </BoxButton>
      <BoxButton
        active={frequency === 'monthly'}
        onPress={() => {
          scroll.current!.scrollToEnd();
          onChangeFrequency('monthly');
        }}
        style={styles.boxButton}
      >
        monthly
      </BoxButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  boxButton: {
    marginRight: theme.spacing.tiny
  },
  container: {
    flexDirection: 'row'
  },
  content: {
    paddingHorizontal: theme.spacing.normal
  }
});
