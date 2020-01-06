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
import { StyleSheet, Text, View } from 'react-native';

import { CigaretteBlock, CurrentLocation } from '../../../components';
import {
  ApiContext,
  CurrentLocationContext,
  FrequencyContext
} from '../../../stores';
import * as theme from '../../../util/theme';

const LANDING_PAGE = 'https://shootismoke.github.io';

const styles = StyleSheet.create({
  container: {
    ...theme.withPadding,
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingTop: theme.spacing.normal,
    paddingBottom: theme.spacing.normal,
    width: 400,
    backgroundColor: 'white'
  },

  urlText: {
    ...theme.text,
    alignSelf: 'center',
    marginTop: theme.spacing.mini
  }
});

export function ShareImage(): React.ReactElement {
  const { api } = useContext(ApiContext);
  const { currentLocation } = useContext(CurrentLocationContext);
  const { frequency } = useContext(FrequencyContext);

  if (!currentLocation) {
    throw new Error(
      'ShareScreen/ShareImage/ShareImage.tsx only render when `currentLocation` is defined.'
    );
  } else if (!api) {
    throw new Error(
      'ShareScreen/ShareImage/ShareImage.tsx only render when `api` is defined.'
    );
  }

  const cigarettesPerDay = api ? api.shootismoke.dailyCigarettes : 0;

  return (
    <View style={styles.container}>
      <CigaretteBlock
        cigarettesPerDay={cigarettesPerDay}
        displayFrequency
        frequency={frequency}
        isGps={false}
        style={{ paddingHorizontal: 0 }}
      />
      <View>
        <CurrentLocation
          api={api}
          currentLocation={currentLocation}
          numberOfLines={2}
        />
      </View>
      <Text style={styles.urlText}>{LANDING_PAGE}</Text>
    </View>
  );
}
