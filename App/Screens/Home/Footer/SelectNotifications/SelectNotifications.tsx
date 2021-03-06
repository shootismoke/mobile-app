// Sh**t! I Smoke
// Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.

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

import Switch from '@dooboo-ui/native-switch-toggle';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Frequency, MongoUser, retry, sideEffect } from '@shootismoke/ui';
import * as Notifications from 'expo-notifications';
import * as Localization from 'expo-localization';
import * as Permissions from 'expo-permissions';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale } from 'react-native-size-matters';

import { ActionPicker } from '../../../../components';
import { t } from '../../../../localization';
import { ApiContext } from '../../../../stores';
import { AmplitudeEvent, track } from '../../../../util/amplitude';
import { promiseToTE } from '../../../../util/fp';
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

/**
 * Convert hex to rgba.
 * @see https://stackoverflow.com/questions/21646738/convert-hex-to-rgba#answer-51564734
 */
function hex2rgba(hex: string, alpha = 1): string {
	const matches = hex.match(/\w\w/g);
	if (!matches) {
		throw new Error(`Invalid hex: ${hex}`);
	}

	const [r, g, b] = matches.map((x) => parseInt(x, 16));

	return `rgba(${r},${g},${b},${alpha})`;
}

type SelectNotificationsProps = ViewProps;

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	label: {
		...theme.text,
		textTransform: 'uppercase',
	},
	labelFrequency: {
		...theme.text,
		color: theme.primaryColor,
		fontFamily: theme.gothamBlack,
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
							`<SelectNotifications> - Got unknown frequency "${lastChosenFrequency}" from AsyncStorage.`
						);
					}

					const f = lastChosenFrequency as Frequency;
					console.log(
						`<SelectNotifications> - Got frequency "${f}" from AsyncStorage.`
					);

					// We're optimistic that the backend frequency is the same
					// as the one saved in AsyncStorage, so we set it.
					setOptimisticNotif(f);
				}
			})
			.then(() => {
				return Permissions.getAsync(
					Permissions.NOTIFICATIONS
				).then(({ status }) =>
					status === 'granted'
						? Notifications.getExpoPushTokenAsync().then(
								({ data }) => getUser(data)
						  )
						: undefined
				);
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
	function handleChangeNotif(frequency: Frequency | 'never'): void {
		setOptimisticNotif(frequency);

		track(
			`HOME_SCREEN_NOTIFICATIONS_${frequency.toUpperCase()}` as AmplitudeEvent
		);

		if (!api) {
			throw new Error(
				'Home/SelectNotifications/SelectNotifications.tsx only gets displayed when `api` is defined.'
			);
		}

		pipe(
			promiseToTE(
				() => Permissions.askAsync(Permissions.NOTIFICATIONS),
				'SelectNotifications'
			),
			TE.chain(({ status }) => {
				if (status === 'granted') {
					return TE.right(undefined);
				} else {
					track('HOME_SCREEN_NOTIFICATIONS_PERMISSIONS_DENIED');

					return TE.left(
						new Error(
							'Permission to access notifications was denied'
						)
					);
				}
			}),
			TE.chain(() =>
				// Retry 3 times to get the Expo push token, sometimes we get an Error
				// "Couldn't get GCM token for device" on 1st try" or
				// "Fetching the token failed: SERVICE_NOT_AVAILABLE"
				// It seems the correct solution is an exponential backoff:
				// https://github.com/firebase/firebase-android-sdk/issues/158
				retry(
					() =>
						promiseToTE(
							() => Notifications.getExpoPushTokenAsync(),
							'SelectNotifications'
						),
					{
						exponentialBackoff: 200, // retry first after 200ms
						retries: 4,
					}
				)
			),
			TE.map((expoPushToken) => ({
				expoPushToken: expoPushToken.data,
				frequency,
				timezone: Localization.timezone,
				lastStationId: api.pm25.location,
			})),
			TE.chain((notifications) =>
				promiseToTE(() => {
					if (!currentUser) {
						if (notifications.frequency === 'never') {
							return Promise.resolve(undefined);
						} else {
							return createUser({
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
							return deleteUser(currentUser._id).then(
								() => undefined // Set currentUser to undefined after deletion.
							);
						} else {
							return updateUser(currentUser._id, {
								expoReport: {
									expoPushToken: notifications.expoPushToken,
									frequency: notifications.frequency,
								},
							});
						}
					}
				}, 'SelectNotifications')
			),
			TE.chain(
				sideEffect((user) => {
					setCurrentUser(user);

					return TE.right(undefined);
				})
			),
			TE.fold(
				(error) => {
					sentryError('SelectNotifications')(error);
					setOptimisticNotif(undefined);

					track('HOME_SCREEN_NOTIFICATIONS_ERROR');

					return T.of(undefined);
				},
				() => {
					setOptimisticNotif(undefined);

					return T.of(undefined);
				}
			)
		)().catch(sentryError('SelectNotifications'));
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
				if (buttonIndex === 4) {
					// 4 is cancel

					track('HOME_SCREEN_NOTIFICATIONS_CANCEL');
					return;
				}

				handleChangeNotif(notificationsValues[buttonIndex]); // +1 because we skipped neve
			}}
		>
			{(open): React.ReactElement => (
				<View style={[styles.container, style]} {...rest}>
					<Switch
						backgroundColorOn={theme.primaryColor}
						backgroundColorOff={hex2rgba(
							theme.secondaryTextColor,
							theme.disabledOpacity
						)}
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
