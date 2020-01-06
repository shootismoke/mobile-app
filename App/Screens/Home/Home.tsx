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

import React, { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import { CigaretteBlock, getCigaretteCount } from '../../components';
import {
  ApiContext,
  CurrentLocationContext,
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
  withMargin: {
    marginTop: theme.spacing.normal
  }
});

export function Home(props: HomeProps): React.ReactElement {
  const { api } = useContext(ApiContext);
  const { isGps } = useContext(CurrentLocationContext);
  const { frequency } = useContext(FrequencyContext);

  trackScreen('HOME');

  const cigarettesPerDay = api ? api.shootismoke.dailyCigarettes : 0;

  return (
    <View style={styles.container}>
      <SmokeVideo cigarettes={getCigaretteCount(frequency, cigarettesPerDay)} />
      <Header
        onChangeLocationClick={(): void => {
          track('HOME_SCREEN_CHANGE_LOCATION_CLICK');
          props.navigation.navigate('Search');
        }}
      />
      <ScrollView bounces={false}>
        <CigaretteBlock
          cigarettesPerDay={cigarettesPerDay}
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
