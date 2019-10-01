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

import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import { AdditionalInfo } from './AdditionalInfo';
import { CigaretteBlock } from './CigaretteBlock';
import { Footer } from './Footer';
import { Header } from './Header';
import { Frequency, SelectFrequency } from './SelectFrequency';
import { SmokeVideo } from './SmokeVideo';
import { ApiContext } from '../../stores';
import { Api } from '../../stores/fetchApi';
import { track, trackScreen } from '../../util/amplitude';
import * as theme from '../../util/theme';

interface HomeProps extends NavigationInjectedProps {}

/**
 * Compute the number of cigarettes to show
 */
function getCigaretteCount (frequency: Frequency, api: Api) {
  switch (frequency) {
    case 'daily': {
      return api.shootISmoke.cigarettes;
    }
    case 'weekly':
      return api.shootISmoke.cigarettes * 7;
    case 'monthly': {
      return api.shootISmoke.cigarettes * 30;
    }
  }
}

export function Home (props: HomeProps) {
  const { api } = useContext(ApiContext);
  const [frequency, setFrenquency] = useState<Frequency>('daily');

  const cigaretteCount = getCigaretteCount(frequency, api!);

  trackScreen('HOME');

  return (
    <View style={styles.container}>
      <SmokeVideo cigarettes={cigaretteCount} />
      <Header
        onChangeLocationClick={() => {
          track('HOME_SCREEN_CHANGE_LOCATION_CLICK');
          props.navigation.navigate('Search');
        }}
      />
      <ScrollView bounces={false}>
        <CigaretteBlock
          cigaretteCount={cigaretteCount}
          frequency={frequency}
          style={styles.withMargin}
        />
        <SelectFrequency
          frequency={frequency}
          onChangeFrequency={freq => {
            if (freq === 'daily') {
              track('HOME_SCREEN_DAILY_CLICK');
            } else if (freq === 'weekly') {
              track('HOME_SCREEN_WEEKLY_CLICK');
            } else if (freq === 'monthly') {
              track('HOME_SCREEN_MONTHLY_CLICK');
            }

            setFrenquency(freq);
          }}
          style={styles.withMargin}
        />
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  withMargin: {
    marginTop: theme.spacing.normal
  }
});
