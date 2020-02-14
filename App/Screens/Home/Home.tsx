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

import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import { CigaretteBlock } from '../../components';
import {
  ApiContext,
  CurrentLocationContext,
  Frequency,
  FrequencyContext
} from '../../stores';
import { track, trackScreen } from '../../util/amplitude';
import * as theme from '../../util/theme';
import { AdditionalInfo } from './AdditionalInfo';
import { Footer } from './Footer';
import { Header } from './Header';
import { SelectFrequency } from './SelectFrequency';
import { SmokeVideo } from './SmokeVideo';

type HomeProps = NavigationInjectedProps;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  footer: {
    marginBottom: theme.spacing.big
  },
  scroll: {
    flex: 1
  },
  withMargin: {
    marginTop: theme.spacing.normal
  }
});

interface Cigarettes {
  /**
   * The current number of cigarettes shown on this Home screen
   */
  count: number;
  /**
   * Denotes whether the cigarette count is exact or not. It's usually exact.
   * The only case where it's not exact, it's when we fetch weekly/monthly
   * cigarettes count, and the backend doesn't give us data back, then we
   * just multiply the daily count by 7 or 30, and put exact=false.
   */
  exact: boolean;
  /**
   * The frequency on this cigarettes number
   */
  frequency: Frequency;
}

export function Home(props: HomeProps): React.ReactElement {
  const { api } = useContext(ApiContext);
  const { currentLocation } = useContext(CurrentLocationContext);
  const { frequency } = useContext(FrequencyContext);

  if (!api) {
    throw new Error('Home/Home.tsx only gets displayed when `api` is defined.');
  } else if (!currentLocation) {
    throw new Error(
      'Home/Home.tsx only gets displayed when `currentLocation` is defined.'
    );
  }

  trackScreen('HOME');

  // Decide on how many cigarettes we want to show on the Home screen.
  const [cigarettes, setCigarettes] = useState<Cigarettes>({
    count: api.shootismoke.dailyCigarettes,
    exact: true,
    frequency
  });
  useEffect(() => {
    setCigarettes({
      count:
        api.shootismoke.dailyCigarettes *
        (frequency === 'daily' ? 1 : frequency === 'weekly' ? 7 : 30),
      // Since for weeky and monthyl, we just multiply, it's not exact
      exact: frequency === 'daily',
      frequency
    });
  }, [api, frequency]);

  return (
    <View style={styles.container}>
      <SmokeVideo cigarettes={cigarettes.count} />
      <Header
        onChangeLocationClick={(): void => {
          track('HOME_SCREEN_CHANGE_LOCATION_CLICK');
          props.navigation.navigate('Search');
        }}
      />
      <ScrollView bounces={false} style={styles.scroll}>
        <CigaretteBlock
          cigarettes={cigarettes.count}
          style={styles.withMargin}
        />
        <SelectFrequency style={styles.withMargin} />
        <AdditionalInfo
          exactCount={cigarettes.exact}
          frequency={frequency}
          navigation={props.navigation}
          style={styles.withMargin}
        />
        <Footer
          navigation={props.navigation}
          style={[styles.withMargin, styles.footer]}
        />
      </ScrollView>
    </View>
  );
}
