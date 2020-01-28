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

import { openaq } from '@shootismoke/dataproviders';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import { CigaretteBlock } from '../../components';
import {
  ApiContext,
  CurrentLocationContext,
  FrequencyContext
} from '../../stores';
import { track, trackScreen } from '../../util/amplitude';
import { logFpError } from '../../util/fp';
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
  withMargin: {
    marginTop: theme.spacing.normal
  }
});

export function Home(props: HomeProps): React.ReactElement {
  const { api } = useContext(ApiContext);
  const { currentLocation, isGps } = useContext(CurrentLocationContext);
  const { frequency, setFrequency } = useContext(FrequencyContext);

  if (!api) {
    throw new Error('Home/Home.tsx only gets displayed when `api` is defined.');
  } else if (!currentLocation) {
    throw new Error(
      'Home/Home.tsx only gets displayed when `currentLocation` is defined.'
    );
  }

  const [cigarettes, setCigarettes] = useState(api.shootismoke.dailyCigarettes);

  trackScreen('HOME');

  useEffect(() => {
    // We don't fetch historical data on daily frequency
    if (frequency === 'daily') {
      setCigarettes(api.shootismoke.dailyCigarettes);
    } else {
      const dateFrom = new Date();
      if (frequency === 'weekly') {
        dateFrom.setDate(dateFrom.getDate() - 7);
      }
      if (frequency === 'monthly') {
        dateFrom.setDate(dateFrom.getDate() - 30);
      }

      pipe(
        openaq.fetchByGps(currentLocation, {
          dateFrom,
          limit: 100,
          parameter: ['pm25']
        }),
        TE.fold(
          () => {
            // Fallback to daily if there's an error
            setFrequency('daily');

            return T.of(void undefined);
          },
          results => {
            console.log(results);
            setCigarettes(2);

            return T.of(void undefined);
          }
        )
      )().catch(logFpError('Home'));
    }
  }, [
    api.shootismoke.dailyCigarettes,
    currentLocation,
    frequency,
    setFrequency
  ]);

  return (
    <View style={styles.container}>
      <SmokeVideo cigarettes={cigarettes} />
      <Header
        onChangeLocationClick={(): void => {
          track('HOME_SCREEN_CHANGE_LOCATION_CLICK');
          props.navigation.navigate('Search');
        }}
      />
      <ScrollView bounces={false}>
        <CigaretteBlock
          cigarettes={cigarettes}
          frequency={frequency}
          isGps={isGps}
          style={styles.withMargin}
        />
        <SelectFrequency style={styles.withMargin} />
        <AdditionalInfo
          frequency={frequency}
          navigation={props.navigation}
          style={styles.withMargin}
        />
        <Footer navigation={props.navigation} style={styles.withMargin} />
      </ScrollView>
    </View>
  );
}
