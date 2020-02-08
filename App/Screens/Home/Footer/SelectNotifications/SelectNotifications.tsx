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

import { useActionSheet } from '@expo/react-native-action-sheet';
import { FontAwesome } from '@expo/vector-icons';
import { Frequency } from '@shootismoke/graphql';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import React, { useContext, useEffect, useState } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps
} from 'react-native';
import { scale } from 'react-native-size-matters';
import Switch from 'react-native-switch-pro';

import { i18n } from '../../../../localization';
import { ApiContext } from '../../../../stores';
import { updateNotifications } from '../../../../stores/util';
import { logFpError, promiseToTE } from '../../../../util/fp';
import * as theme from '../../../../util/theme';

const STORAGE_KEY = 'NOTIFICATIONS';

const notificationsValues = ['never', 'daily', 'weekly', 'monthly'] as const;

/**
 * Capitalize a string.
 *
 * @param s - String to capitalize
 */
function capitalize(s: string): string {
  return s[0].toUpperCase() + s.slice(1);
}

/**
 * Convert hex to rgba.
 * @see https://stackoverflow.com/questions/21646738/convert-hex-to-rgba#answer-51564734
 */
function hex2rgba(hex: string, alpha = 1): string {
  const matches = hex.match(/\w\w/g);
  if (!matches) {
    throw new Error(`Invalid hex: ${hex}`);
  }

  const [r, g, b] = matches.map(x => parseInt(x, 16));

  return `rgba(${r},${g},${b},${alpha})`;
}

type SelectNotificationsProps = ViewProps;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  label: {
    ...theme.text,
    textTransform: 'uppercase'
  },
  labelFrequency: {
    ...theme.text,
    color: theme.primaryColor,
    fontFamily: theme.gothamBlack,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  switch: {
    marginRight: theme.spacing.small
  }
});

export function SelectNotifications(
  props: SelectNotificationsProps
): React.ReactElement {
  const { style, ...rest } = props;
  const [notif, setNotif] = useState<Frequency>('never');
  const { api } = useContext(ApiContext);
  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    async function getNotifications(): Promise<void> {
      const value = await AsyncStorage.getItem(STORAGE_KEY);

      if (value && notificationsValues.includes(value as Frequency)) {
        setNotif(value as Frequency);
      }
    }

    getNotifications();
  }, []);

  useEffect(() => {
    if (!api) {
      throw new Error(
        'Home/SelectNotifications/SelectNotifications.tsx only gets displayed when `api` is defined.'
      );
    }

    pipe(
      updateNotifications(notif, api.pm25.location),
      TE.chain(() =>
        promiseToTE(() => AsyncStorage.setItem(STORAGE_KEY, notif))
      )
    )().catch(logFpError('SelectNotifications'));
  }, [api, notif]);

  function handleActionSheet(): void {
    showActionSheetWithOptions(
      {
        options: notificationsValues
          .filter(f => f !== 'never') // Don't show never in options
          .map(f => i18n.t(`home_frequency_${f}`)) // Translate
          .map(capitalize)
      },
      buttonIndex => {
        setNotif(notificationsValues[buttonIndex + 1]); // +1 because we skipped neve
      }
    );
  }

  // Is the switch on or off?
  const isSwitchOn = notif !== 'never';

  return (
    <View style={[styles.container, style]} {...rest}>
      <Switch
        backgroundActive={theme.primaryColor}
        backgroundInactive={hex2rgba(
          theme.secondaryTextColor,
          theme.disabledOpacity
        )}
        circleStyle={{
          height: scale(22),
          marginHorizontal: scale(3),
          width: scale(22)
        }}
        height={scale(28)}
        onSyncPress={(on: boolean): void => {
          if (on) {
            setNotif('weekly');
          } else {
            setNotif('never');
          }
        }}
        style={styles.switch}
        value={isSwitchOn}
        width={scale(48)}
      />
      {isSwitchOn ? (
        <TouchableOpacity onPress={handleActionSheet}>
          <Text style={styles.label}>{i18n.t('home_frequency_notify_me')}</Text>
          <Text style={styles.labelFrequency}>
            {i18n.t(`home_frequency_${notif}`)}{' '}
            <FontAwesome name="caret-down" />
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.label}>
          {i18n.t('home_frequency_allow_notifications')}
        </Text>
      )}
    </View>
  );
}
