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
import { subDays } from 'date-fns';
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
import { pm25ToCigarettes } from '../../util/secretSauce';
import { sumInDays } from '../../util/stepAverage';
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

  const [cigarettes, setCigarettes] = useState({
    count: api.shootismoke.dailyCigarettes,
    /**
     * Denotes whether the cigarette count is exact or not. It's usually exact.
     * The only case where it's not exact, it's when we fetch weekly/monthly
     * cigarettes count, and the backend doesn't give us data back, then we
     * just multiply the daily count by 7 or 30, and put exact=false.
     */
    exact: true
  });

  trackScreen('HOME');

  useEffect(() => {
    // We don't fetch historical data on daily frequency
    if (frequency === 'daily') {
      setCigarettes({
        count: api.shootismoke.dailyCigarettes,
        exact: true
      });
    } else {
      pipe(
        openaq.fetchByGps(currentLocation, {
          dateFrom: subDays(new Date(), frequency === 'weekly' ? 7 : 30),
          dateTo: new Date(),
          limit: 100,
          parameter: ['pm25']
        }),
        TE.chain(({ results }) =>
          results.length
            ? TE.right(results)
            : TE.left(
                new Error(
                  `Data for ${frequency} measurements has ${results.length} items`
                )
              )
        ),
        TE.map(results => {
          return results.map(({ date: { utc }, value }) => ({
            time: new Date(utc),
            value
          }));
        }),
        TE.map(data => sumInDays(data, frequency)),
        TE.map(pm25ToCigarettes),
        TE.fold(
          error => {
            console.log(`<Home> - ${error.message}`);
            // Fallback to daily if there's an error
            setCigarettes({
              count:
                api.shootismoke.dailyCigarettes *
                (frequency === 'weekly' ? 7 : 30),
              exact: false
            });

            return T.of(void undefined);
          },
          totalCigarettes => {
            setCigarettes({
              count: totalCigarettes,
              exact: true
            });

            return T.of(void undefined);
          }
        )
      )().catch(logFpError('Home'));
    }
  }, [api, currentLocation, frequency, setFrequency]);

  return (
    <View style={styles.container}>
      <SmokeVideo cigarettes={cigarettes.count} />
      <Header
        onChangeLocationClick={(): void => {
          track('HOME_SCREEN_CHANGE_LOCATION_CLICK');
          props.navigation.navigate('Search');
        }}
      />
      <ScrollView bounces={false}>
        <CigaretteBlock
          cigarettes={cigarettes.count}
          frequency={frequency}
          isGps={isGps}
          style={styles.withMargin}
        />
        <SelectFrequency style={styles.withMargin} />
        <AdditionalInfo
          exactCount={cigarettes.exact}
          frequency={frequency}
          navigation={props.navigation}
          style={styles.withMargin}
        />
        <Footer navigation={props.navigation} style={styles.withMargin} />
      </ScrollView>
    </View>
  );
}
