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

import { convert } from '@shootismoke/convert';
import { getDominantPol } from '@shootismoke/dataproviders';
import { formatDistanceToNow } from 'date-fns';
import React, { useContext } from 'react';
import {
  GestureResponderEvent,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View
} from 'react-native';

import locationIcon from '../../../../assets/images/location.png';
import { BackButton, CurrentLocation } from '../../../components';
import { i18n } from '../../../localization';
import { ApiContext, CurrentLocationContext } from '../../../stores';
import * as theme from '../../../util/theme';

interface HeaderProps {
  onBackClick: (event: GestureResponderEvent) => void;
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: theme.spacing.normal
  },
  changeLocation: {
    marginRight: theme.spacing.normal
  },
  container: {
    ...theme.elevationShadowStyle(2, 'bottom'),
    ...theme.withPadding,
    backgroundColor: 'white',
    paddingBottom: theme.spacing.small,
    paddingTop: theme.spacing.normal,
    zIndex: 1
  },
  content: {
    flex: 1
  },
  currentLocation: {
    marginBottom: theme.spacing.normal
  },
  info: {
    ...theme.text,
    marginVertical: 5
  },
  label: {
    color: theme.primaryColor,
    fontFamily: theme.gothamBlack
  },
  layout: {
    flexDirection: 'row'
  },
  pollutantItem: {
    flexBasis: '45%'
  },
  pollutants: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.normal
  }
});

const renderInfo = (
  label: string,
  value: string | number,
  style?: StyleProp<TextStyle>
): React.ReactElement => {
  return (
    <Text key={label} style={[styles.info, style]}>
      <Text style={styles.label}>{label}</Text> {value}
    </Text>
  );
};

export function Header(props: HeaderProps): React.ReactElement {
  const { onBackClick } = props;
  const { api } = useContext(ApiContext);
  const { currentLocation } = useContext(CurrentLocationContext);

  if (!currentLocation) {
    throw new Error(
      'Details/Header/Header.tsx only render when `currentLocation` is defined.'
    );
  } else if (!api) {
    throw new Error(
      'Details/Header/Header.tsx only render when `api` is defined.'
    );
  }

  return (
    <View style={styles.container}>
      <BackButton onPress={onBackClick} style={styles.backButton} />

      <View style={styles.layout}>
        <Image source={locationIcon} style={styles.changeLocation} />

        <View style={styles.content}>
          <CurrentLocation
            api={api}
            currentLocation={currentLocation}
            style={styles.currentLocation}
          />
          {renderInfo(
            i18n.t('details_header_latest_update_label'),
            `${formatDistanceToNow(new Date(api.pm25.date.local))} ${i18n.t(
              'details_header_latest_update_ago'
            )}`
          )}
          {renderInfo(
            i18n.t('details_header_primary_pollutant_label'),
            getDominantPol(api.normalized).toUpperCase()
          )}

          <View style={styles.pollutants}>
            {api.normalized.map(normalized => {
              return renderInfo(
                `${normalized.parameter.toUpperCase()} AQI:`,
                convert(
                  normalized.parameter,
                  'raw',
                  'usaEpa',
                  normalized.value
                ),
                styles.pollutantItem
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
