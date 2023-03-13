// Shoot! I Smoke
// Copyright (C) 2018-2023  Marcelo S. Coelho, Amaury M.

// Shoot! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Shoot! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Shoot! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import Switch from '@dooboo-ui/native-switch-toggle';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Frequency, MongoUser } from '@shootismoke/ui';
import * as Notifications from 'expo-notifications';
import * as Localization from 'expo-localization';
import retry from 'async-retry';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale } from 'react-native-size-matters';

import { ActionPicker } from '../../../../components';
import { t } from '../../../../localization';
import { ApiContext } from '../../../../stores';
import { AmplitudeEvent, track } from '../../../../util/amplitude';
import {
	createUser,
	deleteUser,
	getUser,
	updateUser,
} from '../../../../util/axios';
import { sentryError } from '../../../../util/sentry';
import * as theme from '../../../../util/theme';

const notificationsValues = ['never', 'daily', 'weekly', 'monthly'] as const;

/**
 * Key in the AsyncStorage for the last chosen frequency. It's used for
 * optimistic UI in the frequency selector.
 */
const KEY_LAST_CHOSEN_FREQUENCY = 'lastChosenFrequency';

/**
 * Capitalize a string.
 *
 * @param s - String to capitalize
 */
function capitalize(s: string): string {
	return s[0].toUpperCase() + s.slice(1);
}

type SelectNotificationsProps = ViewProps;

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	label: {
		...theme.text,
		color: theme.colors.gray600,
		textTransform: 'uppercase',
	},
	labelFrequency: {
		...theme.text,
		color: theme.colors.orange,
		fontFamily: theme.Montserrat800,
		fontWeight: '900',
		textTransform: 'uppercase',
	},
	switchCircle: {
		borderRadius: scale(11),
		height: scale(22),
		width: scale(22),
	},
	switchContainer: {
		borderRadius: scale(14),
		height: scale(28),
		marginRight: theme.spacing.small,
		padding: scale(3),
		width: scale(48),
	},
});

async function askForPermissions(): Promise<string> {
	const { status: existing } = await Notifications.getPermissionsAsync();

	let finalStatus = existing;
	if (existing !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	return finalStatus;
}

export function SelectNotifications(
	props: SelectNotificationsProps
): React.ReactElement {
	const { style, ...rest } = props;
	const { api } = useContext(ApiContext);

	// User stored in AsyncStorage.
	const [currentUser, setCurrentUser] = useState<MongoUser>();

	// Fetch data from backend.
	useEffect(() => {
		AsyncStorage.getItem(KEY_LAST_CHOSEN_FREQUENCY)
			.then((lastChosenFrequency) => {
				if (lastChosenFrequency) {
					if (
						!(notificationsValues as readonly string[]).includes(
							lastChosenFrequency
						)
					) {
						throw new Error(
							`[SelectNotifications]: Got unknown frequency "${lastChosenFrequency}" from AsyncStorage.`
						);
					}

					const f = lastChosenFrequency as Frequency;
					console.log(
						`[SelectNotifications]: Got frequency "${f}" from AsyncStorage.`
					);

					// We're optimistic that the backend frequency is the same
					// as the one saved in AsyncStorage, so we set it.
					setOptimisticNotif(f);
				}
			})
			.then(async () => {
				if ((await askForPermissions()) !== 'granted') {
					return;
				}
				const { data } = await Notifications.getExpoPushTokenAsync();
				return getUser(data);
			})
			.then((user) => user && setCurrentUser(user))
			.catch(sentryError('SelectNotifications'));
	}, []);

	// Update lastChosenFrequency in AsyncStorage each time it changes.
	useEffect(() => {
		(currentUser?.expoReport?.frequency
			? AsyncStorage.setItem(
					KEY_LAST_CHOSEN_FREQUENCY,
					currentUser.expoReport.frequency
			  )
			: AsyncStorage.removeItem(KEY_LAST_CHOSEN_FREQUENCY)
		).catch(sentryError('SelectNotifications'));
	}, [currentUser]);

	// This state is used for optimistic UI: right after the user clicks, we set
	// this state to what the user clicked. When the actual mutation resolves, we
	// populate with the real data.
	const [optimisticNotif, setOptimisticNotif] = useState<
		Frequency | 'never'
	>();

	const notif =
		// If we have optimistic UI, show it
		optimisticNotif ||
		// If we have up-to-date data from backend, take that
		currentUser?.expoReport?.frequency ||
		// If the getUser function is still loading, just show `never`
		'never';

	/**
	 * Handler for changing notification frequency
	 *
	 * @param buttonIndex - The button index in the ActionSheet
	 */
	async function handleChangeNotif(
		frequency: Frequency | 'never'
	): Promise<void> {
		try {
			setOptimisticNotif(frequency);

			track(
				`HOME_SCREEN_NOTIFICATIONS_${frequency.toUpperCase()}` as AmplitudeEvent
			);

			if (!api) {
				throw new Error(
					'Home/SelectNotifications/SelectNotifications.tsx only gets displayed when `api` is defined.'
				);
			}

			const status = await askForPermissions();

			if (status !== 'granted') {
				track('HOME_SCREEN_NOTIFICATIONS_PERMISSIONS_DENIED');
				throw new Error(
					'Permission to access notifications was denied'
				);
			}

			// Retry 3 times to get the Expo push token, sometimes we get an Error
			// "Couldn't get GCM token for device" on 1st try" or
			// "Fetching the token failed: SERVICE_NOT_AVAILABLE"
			// It seems the correct solution is an exponential backoff:
			// https://github.com/firebase/firebase-android-sdk/issues/158
			const expoPushToken = await retry(
				() => Notifications.getExpoPushTokenAsync(),
				{
					retries: 3,
				}
			);

			const notifications = {
				expoPushToken: expoPushToken.data,
				frequency,
				timezone: Localization.timezone,
				lastStationId: api.pm25.location,
			};

			let newUser: MongoUser | undefined;
			if (!currentUser) {
				if (notifications.frequency !== 'never') {
					newUser = await createUser({
						expoReport: {
							expoPushToken: notifications.expoPushToken,
							frequency: notifications.frequency,
						},
						lastStationId: notifications.lastStationId,
						timezone: Localization.timezone,
					});
				}
			} else {
				if (notifications.frequency === 'never') {
					newUser = await deleteUser(currentUser._id);
				} else {
					newUser = await updateUser(currentUser._id, {
						expoReport: {
							expoPushToken: notifications.expoPushToken,
							frequency: notifications.frequency,
						},
					});
				}
			}

			setCurrentUser(newUser);
			setOptimisticNotif(undefined);
		} catch (err) {
			sentryError('SelectNotifications')(err as Error);
			setOptimisticNotif(undefined);

			track('HOME_SCREEN_NOTIFICATIONS_ERROR');
		}
	}

	// Is the switch on or off?
	const isSwitchOn = notif !== 'never';

	return (
		<ActionPicker
			actionSheetOptions={{
				cancelButtonIndex: 4,
				options: notificationsValues
					.map((f) => t(`home_frequency_${f}`)) // Translate
					.map(capitalize)
					.concat(t('home_frequency_notifications_cancel')),
			}}
			amplitudeOpenEvent="HOME_SCREEN_NOTIFICATIONS_OPEN_PICKER"
			callback={(buttonIndex): void => {
				if (!buttonIndex) {
					return;
				}

				if (buttonIndex === 4) {
					// 4 is cancel

					track('HOME_SCREEN_NOTIFICATIONS_CANCEL');
					return;
				}

				handleChangeNotif(notificationsValues[buttonIndex]).catch(
					sentryError('SelectNotifications')
				); // +1 because we skipped never
			}}
		>
			{(open): React.ReactElement => (
				<View style={[styles.container, style]} {...rest}>
					<Switch
						backgroundColorOn={theme.colors.orange}
						backgroundColorOff={theme.colors.gray200}
						circleColorOff="white"
						circleColorOn="white"
						circleStyle={styles.switchCircle}
						containerStyle={styles.switchContainer}
						switchOn={isSwitchOn}
						onPress={open}
						duration={500}
					/>

					{isSwitchOn ? (
						<View>
							<Text style={styles.label}>
								{t('home_frequency_notify_me')}
							</Text>
							<Text style={styles.labelFrequency}>
								{t(`home_frequency_${notif}`)}{' '}
								<Ionicons name="caret-down" />
							</Text>
						</View>
					) : (
						<Text style={styles.label}>
							{t('home_frequency_allow_notifications')}
						</Text>
					)}
				</View>
			)}
		</ActionPicker>
	);
}
