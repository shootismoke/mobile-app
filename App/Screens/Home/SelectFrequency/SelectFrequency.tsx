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

import * as O from 'fp-ts/lib/Option';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { BoxButton } from '../../../components';
import { AqiHistory } from '../../../managers';
import * as theme from '../../../util/theme';

export type Frequency = 'daily' | 'weekly' | 'monthly';

interface SelectFrequencyProps {
  aqiHistory: AqiHistory;
  frequency: Frequency;
  onChangeFrequency: (frequency: Frequency) => void;
  style?: StyleProp<ViewStyle>;
}

export function SelectFrequency (props: SelectFrequencyProps) {
  const scroll = useRef<ScrollView>(null);
  const [dailyWidth, setDailyWidth] = useState(0); // Width of the daily button

  const { aqiHistory, frequency, onChangeFrequency, style } = props;

  return (
    <ScrollView
      bounces={O.isSome(aqiHistory.pastWeek) || O.isSome(aqiHistory.pastMonth)}
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
          if (frequency === 'daily') {
            return;
          }

          scroll.current!.scrollTo({ x: 0 });
          onChangeFrequency('daily');
        }}
        style={styles.boxButton}
      >
        daily
      </BoxButton>
      {O.isSome(aqiHistory.pastWeek) && (
        <BoxButton
          active={frequency === 'weekly'}
          onPress={() => {
            if (frequency === 'weekly') {
              return;
            }

            scroll.current!.scrollTo({
              x: dailyWidth + theme.spacing.tiny
            });
            onChangeFrequency('weekly');
          }}
          style={styles.boxButton}
        >
          weekly
        </BoxButton>
      )}
      {O.isSome(aqiHistory.pastMonth) && (
        <BoxButton
          active={frequency === 'monthly'}
          onPress={() => {
            if (frequency === 'monthly') {
              return;
            }

            scroll.current!.scrollToEnd();
            onChangeFrequency('monthly');
          }}
          style={styles.boxButton}
        >
          monthly
        </BoxButton>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  boxButton: {
    marginRight: theme.spacing.tiny
  },
  container: {
    flexDirection: 'row',
    paddingBottom: theme.spacing.normal
  },
  content: {
    paddingHorizontal: theme.spacing.normal
  }
});
