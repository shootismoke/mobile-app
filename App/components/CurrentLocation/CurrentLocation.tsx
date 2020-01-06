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

import { stationName } from '@shootismoke/dataproviders';
import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { i18n } from '../../localization';
import { Api } from '../../stores';
import { Location } from '../../stores/util/fetchGpsPosition';
import * as theme from '../../util/theme';

const UNKNOWN_STATION = i18n.t('current_location_unknown_station');

interface CurrentLocationProps extends TextProps {
  api: Api;
  currentLocation: Location;
}

const styles = StyleSheet.create({
  title: {
    ...theme.title
  }
});

export function CurrentLocation(
  props: CurrentLocationProps
): React.ReactElement {
  const { api, currentLocation, style, ...rest } = props;

  return (
    <Text style={[styles.title, style]} {...rest}>
      {(
        currentLocation.name ||
        stationName(api.pm25) ||
        UNKNOWN_STATION
      ).toUpperCase()}
    </Text>
  );
}
