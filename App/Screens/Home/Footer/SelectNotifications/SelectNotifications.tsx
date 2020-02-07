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

import { Frequency } from '@shootismoke/graphql';
import React, { useContext, useEffect, useState } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Switch,
  Text,
  View,
  ViewProps
} from 'react-native';

import { ApiContext } from '../../../../stores';
import { updateNotifications } from '../../../../stores/util';
import { logFpError } from '../../../../util/fp';
import * as theme from '../../../../util/theme';

const STORAGE_KEY = 'NOTIFICATIONS';

const notificationsValues = ['never', 'daily', 'weekly', 'monthly'];

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

  async function getNotifications(): Promise<void> {
    const value = await AsyncStorage.getItem(STORAGE_KEY);

    if (value && notificationsValues.includes(value)) {
      setNotif(value as Frequency);
    }
  }

  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    if (!api) {
      throw new Error(
        'Home/SelectNotifications/SelectNotifications.tsx only gets displayed when `api` is defined.'
      );
    }

    AsyncStorage.setItem(STORAGE_KEY, notif);

    updateNotifications(notif, api.pm25.location)().catch(
      logFpError('SelectNotifications')
    );
  }, [api, notif]);

  return (
    <View style={[styles.container, style]} {...rest}>
      <Switch
        onValueChange={(on): void => {
          if (on) {
            setNotif('weekly');
          } else {
            setNotif('never');
          }
        }}
        trackColor={{
          false: theme.textColor,
          true: theme.primaryColor
        }}
        style={styles.switch}
        value={notif !== 'never'}
      />
      {notif === 'never' ? (
        <Text style={styles.label}>Allow{'\n'}notifications?</Text>
      ) : (
        <View>
          <Text>Notify me weekly</Text>
        </View>
      )}
    </View>
  );
}
