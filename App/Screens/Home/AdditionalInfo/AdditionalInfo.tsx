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
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps
} from 'react-native';
import { scale } from 'react-native-size-matters';
import { NavigationInjectedProps } from 'react-navigation';

import { i18n } from '../../../localization';
import { ApiContext, CurrentLocationContext } from '../../../stores';
import { track } from '../../../util/amplitude';
import { isStationTooFar } from '../../../util/station';
import * as theme from '../../../util/theme';
import { aboutSections } from '../../About';
import { Frequency } from '../SelectFrequency';

interface AdditionalInfoProps extends NavigationInjectedProps, ViewProps {
  frequency: Frequency;
}

const styles = StyleSheet.create({
  linkToAbout: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  tag: {
    backgroundColor: '#C4C4C4',
    borderRadius: scale(10),
    marginRight: theme.spacing.mini,
    paddingHorizontal: scale(6),
    paddingVertical: scale(3)
  },
  tagLabel: {
    color: 'white',
    fontSize: scale(10),
    letterSpacing: scale(1),
    marginLeft: scale(2),
    textAlign: 'center'
  }
});

export function AdditionalInfo(
  props: AdditionalInfoProps
): React.ReactElement | null {
  const { api } = useContext(ApiContext);
  const { currentLocation } = useContext(CurrentLocationContext);
  const { frequency, navigation, style, ...rest } = props;

  if (!currentLocation) {
    throw new Error(
      'Home/AdditionalInfo/AdditionalInfo.tsx only gets calculate the `distanceToStation` when `currentLocation` is defined.'
    );
  } else if (!api) {
    throw new Error(
      'Home/AdditionalInfo/AdditionalInfo.tsx only gets calculate the `distanceToStation` when `api` is defined.'
    );
  }

  const isTooFar = isStationTooFar(currentLocation, api);

  function renderBeta(): React.ReactElement {
    return (
      <TouchableOpacity
        onPress={(): void => {
          track('HOME_SCREEN_BETA_INACCURATE_CLICK');
          // eslint-disable-next-line
          navigation.navigate('About', {
            scrollInto: aboutSections.aboutBetaInaccurate
          });
        }}
        style={styles.linkToAbout}
      >
        <View style={styles.tag}>
          <Text style={styles.tagLabel}>BETA</Text>
        </View>
        <Text style={theme.text}>{i18n.t('home_beta_not_accurate')}</Text>
      </TouchableOpacity>
    );
  }

  if (frequency === 'daily' && !isTooFar) {
    return null;
  }

  return (
    <View style={[theme.withPadding, style]} {...rest}>
      {frequency !== 'daily'
        ? renderBeta()
        : isTooFar && (
            <Text style={theme.text}>
              {i18n.t('home_station_too_far_message')}
            </Text>
          )}
    </View>
  );
}
