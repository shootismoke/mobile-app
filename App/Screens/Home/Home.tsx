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

import { LatLng } from '@shootismoke/dataproviders';
import { openaq } from '@shootismoke/dataproviders/lib/promise';
import { subDays } from 'date-fns';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import pMemoize from 'p-memoize';
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
import { logFpError, promiseToTE } from '../../util/fp';
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

/**
 * Memoize the function that fetches historical weekly/monthly cigarettes.
 */
const memoHistoricalCigarettes = pMemoize(
  (frequency: Frequency, currentLocation: LatLng) => {
    return openaq.fetchByGps(currentLocation, {
      dateFrom: subDays(new Date(), frequency === 'weekly' ? 7 : 30),
      dateTo: new Date(),
      limit: 100,
      parameter: ['pm25']
    });
  },
  {
    cacheKey: (frequency: Frequency, { latitude, longitude }: LatLng) => {
      // We cache this function with the following cache key
      return `${frequency}${latitude}${longitude}`;
    }
  }
);

export function Home(props: HomeProps): React.ReactElement {
  const { api } = useContext(ApiContext);
  const { currentLocation } = useContext(CurrentLocationContext);
  const { frequency, setFrequency } = useContext(FrequencyContext);

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
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // We don't fetch historical data on daily frequency
    if (frequency === 'daily') {
      setCigarettes({
        count: api.shootismoke.dailyCigarettes,
        exact: true,
        frequency
      });
    } else {
      setIsLoading(true);

      // Fetch weekly/monthly number of cigarettes depending on the current
      // location.
      pipe(
        promiseToTE(
          () => memoHistoricalCigarettes(frequency, currentLocation),
          'memoHistoricalCigarettes'
        ),
        TE.chain(({ results }) =>
          results.length
            ? TE.right(results)
            : TE.left(
                new Error(
                  `Data for ${frequency} measurements on [${currentLocation.latitude},${currentLocation.longitude}] has no items`
                )
              )
        ),
        TE.map(results => {
          return results.map(({ date: { utc }, value }) => ({
            time: new Date(utc),
            value
          }));
        }),
        TE.map(data => ({
          // Convert the PM2.5 sum to a cigarettes sum
          count: pm25ToCigarettes(sumInDays(data, frequency)),
          exact:
            // We consider that the calculated sums are "exact", if there's at
            // least 60 data points (for monthly sum) or 14 data points (for
            // weekly sums), These 2 numbers are highly arbirtrary, I'm sure
            // there's a more scientific way to find them.
            frequency === 'monthly' ? data.length >= 60 : data.length >= 14
        })),
        TE.fold(
          error => {
            console.log(`<Home> - ${error.message}`);
            // Fallback to daily cigarettes * 7 or * 30 if there's an error
            setCigarettes({
              count:
                api.shootismoke.dailyCigarettes *
                (frequency === 'weekly' ? 7 : 30),
              exact: false,
              frequency
            });
            setIsLoading(false);

            return T.of(void undefined);
          },
          data => {
            setCigarettes({
              ...data,
              frequency
            });
            setIsLoading(false);

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
      <ScrollView bounces={false} style={styles.scroll}>
        <CigaretteBlock
          cigarettes={cigarettes.count}
          loading={isLoading}
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
