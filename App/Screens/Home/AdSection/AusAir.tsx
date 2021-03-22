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

import React, { useState } from 'react';
import {
	Image,
	StyleSheet,
	Text,
	View,
	ImageRequireSource,
	Linking,
	Platform,
} from 'react-native';
import { scale } from 'react-native-size-matters';

import image from '../../../../assets/images/ausair/woman_black_mask.png';
import { Button } from '../../../components';
import * as theme from '../../../util/theme';
import { sentryError } from '../../../util/sentry';
import { track } from '../../../util/amplitude';

const styles = StyleSheet.create({
	button: {
		marginTop: theme.spacing.mini,
		marginBottom: theme.spacing.normal,
	},
	container: {
		...theme.elevationShadowStyle(Platform.OS === 'ios' ? 1 : 10, 'top'),
		...theme.withPadding,
		backgroundColor: '#F7F9FC',
		display: 'flex',
		flexDirection: 'row',
		paddingTop: theme.spacing.normal,
		zIndex: 10,
	},
	description: {
		...theme.typography.type100,
		color: theme.colors.gray600,
		marginTop: theme.spacing.tiny,
	},
	image: {
		bottom: 0,
		left: -10,
		position: 'absolute',
	},
	title: {
		...theme.typography.type400,
		fontFamily: theme.Montserrat400,
		letterSpacing: scale(0.8),
	},
});

const handleOpenAusAir = (): void => {
	track('HOME_SCREEN_AD_AUSAIR_V1WOMANBLACKMASK');
	Linking.openURL('https://shopausair.com/?ref=shootismoke').catch(
		sentryError('AusAir')
	);
};

// We increase the size of the image, so that it's bigger than the container
// div, and the top of the image can float out of the container, giving a
// pretty cool effect.
const IMAGE_INCREASE_FACTOR = 1.2;

export function AusAir(): React.ReactElement {
	const [viewHeight, setViewHeight] = useState(0);

	return (
		<View
			onLayout={({
				nativeEvent: {
					layout: { height },
				},
			}) => setViewHeight(height)}
			style={styles.container}
		>
			<View>
				<Text style={styles.title}>
					AirFlex Filtration{'\n'}MaskPack
				</Text>
				<Text style={styles.description}>
					All day comfort meets{'\n'}&gt;99% filtration.
				</Text>
				<Button
					onPress={handleOpenAusAir}
					style={styles.button}
					type="full"
				>
					BUY NOW
				</Button>
			</View>
			<View>
				{viewHeight ? (
					<Image
						source={image as ImageRequireSource}
						style={[
							styles.image,
							{ height: viewHeight * IMAGE_INCREASE_FACTOR },
						]}
					/>
				) : null}
			</View>
		</View>
	);
}
