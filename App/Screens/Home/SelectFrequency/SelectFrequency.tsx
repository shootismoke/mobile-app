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

import React, { useRef, useContext, useState } from 'react';
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native';

import { BoxButton } from '../../../components';
import { i18n } from '../../../localization';
import { FrequencyContext } from '../../../stores';
import { track } from '../../../util/amplitude';
import * as theme from '../../../util/theme';

export type Frequency = 'daily' | 'weekly' | 'monthly';

export function SelectFrequency (props: ScrollViewProps) {
  const scroll = useRef<ScrollView>(null);
  const { frequency, setFrequency } = useContext(FrequencyContext);
  const [dailyWidth, setDailyWidth] = useState(0); // Width of the daily button

  const { style, ...rest } = props;

  function handleChangeFrequency (f: Frequency) {
    setTimeout(() => {
      setFrequency(f);
    }, 400);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      ref={scroll}
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      {...rest}
    >
      <BoxButton
        active={frequency === 'daily'}
        onLayout={event => setDailyWidth(event.nativeEvent.layout.width)}
        onPress={() => {
          track('HOME_SCREEN_DAILY_CLICK');
          if (frequency === 'daily') {
            return;
          }

          scroll.current!.scrollTo({ x: 0 });
          handleChangeFrequency('daily');
        }}
        style={styles.boxButton}
      >
        {i18n.t('frequency_daily')}
      </BoxButton>
      <BoxButton
        active={frequency === 'weekly'}
        onPress={() => {
          track('HOME_SCREEN_WEEKLY_CLICK');
          if (frequency === 'weekly') {
            return;
          }

          scroll.current!.scrollTo({
            x: dailyWidth + theme.spacing.mini
          });
          handleChangeFrequency('weekly');
        }}
        style={styles.boxButton}
      >
        {i18n.t('frequency_weekly')}
      </BoxButton>

      <BoxButton
        active={frequency === 'monthly'}
        onPress={() => {
          track('HOME_SCREEN_MONTHLY_CLICK');
          if (frequency === 'monthly') {
            return;
          }

          scroll.current!.scrollToEnd();
          handleChangeFrequency('monthly');
        }}
        style={styles.boxButton}
      >
        {i18n.t('frequency_monthly')}
      </BoxButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  boxButton: {
    marginRight: theme.spacing.mini
  },
  container: {
    flexDirection: 'row'
  },
  content: {
    paddingHorizontal: theme.spacing.normal
  }
});
