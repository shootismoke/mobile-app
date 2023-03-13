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

import React, { createRef, useContext } from 'react';
import { Share, StyleSheet, View, ViewProps } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { CircleButton } from '../../../../components';
import { t } from '../../../../localization';
import { ApiContext, CurrentLocationContext } from '../../../../stores';
import { sentryError } from '../../../../util/sentry';
import { ShareImage } from './ShareImage';

type ShareButtonProps = ViewProps;

const styles = StyleSheet.create({
	viewShot: {
		// We don't want to show this on the screen. If you have a better idea how
		// to achieve the same result (e.g. with a CSS equivalent of
		// `visible: hidden`), then open a PR
		left: -9999,
		position: 'absolute',
	},
});

export function ShareButton(props: ShareButtonProps): React.ReactElement {
	const { api } = useContext(ApiContext);
	const { currentLocation } = useContext(CurrentLocationContext);
	const refViewShot = createRef<View>();

	async function handleShare(): Promise<void> {
		if (!api) {
			throw new Error(
				'Home/Footer/ShareButton.tsx only renders when `api` is defined.'
			);
		} else if (!currentLocation) {
			throw new Error(
				'Home/Footer/ShareButton.tsx only renders when `currentLocation` is defined.'
			);
		}

		const imageUrl = await captureRef(refViewShot, {
			format: 'png',
			quality: 1,
		});
		const message = t('home_share_message', {
			city: currentLocation.city
				? `in ${currentLocation.city}`
				: t('home_share_message_here'),
			cigarettes: Math.ceil(api.shootismoke.dailyCigarettes),
		});
		const title = t('home_share_title');

		// FIXME imageUrl doesn't work on Android
		// https://github.com/shootismoke/mobile-app/issues/250
		await Share.share({ message, title, url: imageUrl });
	}

	return (
		<View {...props}>
			<View collapsable={false} ref={refViewShot} style={styles.viewShot}>
				<ShareImage />
			</View>
			<CircleButton
				icon="ios-share-social"
				onPress={() => {
					handleShare().catch(sentryError);
				}}
			/>
		</View>
	);
}
