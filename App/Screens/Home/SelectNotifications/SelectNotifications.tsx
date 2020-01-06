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
import React, { useEffect, useRef, useState } from 'react';
import { AsyncStorage, Picker } from 'react-native';

import { updateNotifications } from '../../../stores/util/updateUser';
import { logFpError } from '../../../util/fp';

const STORAGE_KEY = 'NOTIFICATIONS';

const notificationsValues = ['never', 'daily', 'weekly', 'monthly'];

export function SelectNotifications(): React.ReactElement {
  const [notif, setNotif] = useState<Frequency>('never');

  // We only want to run the [notif] useEffect when the user changes value
  const isUserSelection = useRef(false);

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
    if (isUserSelection.current === false) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, notif);

    updateNotifications(notif)().catch(logFpError('SelectNotifications'));
  }, [notif]);

  return (
    <Picker
      selectedValue={notif}
      onValueChange={(value): void => {
        isUserSelection.current = true;
        setNotif(value);
      }}
    >
      {notificationsValues.map(key => (
        <Picker.Item key={key} label={key} value={key}></Picker.Item>
      ))}
    </Picker>
  );
}
