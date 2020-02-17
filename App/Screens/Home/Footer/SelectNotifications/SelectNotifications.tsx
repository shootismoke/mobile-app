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

import { useMutation } from '@apollo/client';
import { FontAwesome } from '@expo/vector-icons';
import {
  Frequency,
  MutationGetOrCreateUserArgs,
  MutationUpdateUserArgs,
  User
} from '@shootismoke/graphql';
import { Notifications } from 'expo';
import Constants from 'expo-constants';
import * as Localization from 'expo-localization';
import * as Permissions from 'expo-permissions';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { scale } from 'react-native-size-matters';
import Switch from 'react-native-switch-pro';

import { ActionPicker } from '../../../../components';
import { i18n } from '../../../../localization';
import { ApiContext } from '../../../../stores';
import { GET_OR_CREATE_USER, UPDATE_USER } from '../../../../stores/util';
import { AmplitudeEvent, track } from '../../../../util/amplitude';
import { sentryError } from '../../../../util/sentry';
import * as theme from '../../../../util/theme';

/**
 * https://gist.github.com/navix/6c25c15e0a2d3cd0e5bce999e0086fc9
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

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
  const { api } = useContext(ApiContext);
  const [getOrCreateUser, { data: queryData }] = useMutation<
    { getOrCreateUser: User },
    MutationGetOrCreateUserArgs
  >(GET_OR_CREATE_USER, {
    variables: { input: { expoInstallationId: Constants.installationId } }
  });
  const [updateUser, { data: mutationData }] = useMutation<
    { __typename: 'Mutation'; updateUser: DeepPartial<User> },
    MutationUpdateUserArgs
  >(UPDATE_USER);
  // This state is used of optimistic UI: right after the user clicks, we set
  // this state to what the user clicked. When the actual mutation resolves, we
  // populate with the real data.
  const [optimisticNotif, setOptimisticNotif] = useState<Frequency>();

  const notif =
    // If we have optimistic UI, show it
    optimisticNotif ||
    // If we have up-to-date data from backend, take that
    mutationData?.updateUser.notifications?.frequency ||
    // At the beginning, before anything happens, query from backend
    queryData?.getOrCreateUser.notifications?.frequency ||
    // If the queryData is still loading, just show `never`
    'never';

  useEffect(() => {
    getOrCreateUser({
      variables: { input: { expoInstallationId: Constants.installationId } }
    }).catch(sentryError('SelectNotifications'));
  }, [getOrCreateUser]);

  useEffect(() => {
    // If we receive new mutationData, then our optimistic UI is obsolete
    if (mutationData) {
      setOptimisticNotif(undefined);
    }
  }, [mutationData]);

  /**
   * Handler for changing notification frequency
   *
   * @param buttonIndex - The button index in the ActionSheet
   */
  function handleChangeNotif(frequency: Frequency): void {
    setOptimisticNotif(frequency);

    track(
      `HOME_SCREEN_NOTIFICATIONS_${frequency.toUpperCase()}` as AmplitudeEvent
    );

    async function updateNotification(): Promise<void> {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

      if (status !== 'granted') {
        throw new Error('Permission to access notifications was denied');
      }

      if (!api) {
        throw new Error(
          'Home/SelectNotifications/SelectNotifications.tsx only gets displayed when `api` is defined.'
        );
      }

      const expoPushToken = await Notifications.getExpoPushTokenAsync();
      const notifications = {
        expoPushToken,
        frequency,
        timezone: Localization.timezone,
        universalId: api.pm25.location
      };
      console.log(
        `<SelectNotifications> - Update user ${JSON.stringify(notifications)}`
      );

      await updateUser({
        variables: {
          expoInstallationId: Constants.installationId,
          input: { notifications }
        }
      });
    }

    updateNotification().catch(sentryError('SelectNotifications'));
  }

  // Is the switch on or off?
  const isSwitchOn = notif !== 'never';

  return (
    <ActionPicker
      actionSheetOptions={{
        cancelButtonIndex: 4,
        options: notificationsValues
          .map(f => i18n.t(`home_frequency_${f}`)) // Translate
          .map(capitalize)
      }}
      callback={(buttonIndex): void => {
        if (buttonIndex === 4) {
          // 4 is cancel
          return;
        }

        handleChangeNotif(notificationsValues[buttonIndex]); // +1 because we skipped neve
      }}
    >
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
          style={styles.switch}
          value={isSwitchOn}
          width={scale(48)}
        />

        {isSwitchOn ? (
          <View>
            <Text style={styles.label}>
              {i18n.t('home_frequency_notify_me')}
            </Text>
            <Text style={styles.labelFrequency}>
              {i18n.t(`home_frequency_${notif}`)}{' '}
              <FontAwesome name="caret-down" />
            </Text>
          </View>
        ) : (
          <Text style={styles.label}>
            {i18n.t('home_frequency_allow_notifications')}
          </Text>
        )}
      </View>
    </ActionPicker>
  );
}
