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

import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { Api } from '../../stores/fetchApi';
import { fetchReverseGeocode, Location } from '../../stores/fetchGpsPosition';
import * as theme from '../../util/theme';

interface CurrentLocationProps extends TextProps {
  api: Api;
  currentLocation: Location;
}

// Text to show when fetching reverse geocoding
const LOADING_TEXT = 'Fetching...';

export function CurrentLocation (props: CurrentLocationProps) {
  const { api, currentLocation, style, ...rest } = props;
  const [locationName, setLocationName] = useState(
    currentLocation.name || LOADING_TEXT
  );

  useEffect(() => {
    if (currentLocation.name) {
      return;
    }

    pipe(
      fetchReverseGeocode(currentLocation),
      TE.fold(
        () => {
          setLocationName(
            api.city && api.city.name ? api.city.name : 'Unknown AQI Station'
          );

          return T.of(undefined);
        },
        ({ name }) => {
          if (name) {
            setLocationName(name);
          }

          return T.of(undefined);
        }
      )
    )();
  }, []);

  return (
    <Text style={[styles.title, style]} {...rest}>
      {locationName.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    ...theme.title
  }
});
