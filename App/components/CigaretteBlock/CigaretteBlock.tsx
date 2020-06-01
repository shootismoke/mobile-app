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

import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { scale } from 'react-native-size-matters';

import { t } from '../../localization';
import { Frequency } from '../../stores';
import * as theme from '../../util/theme';
import { Cigarettes, CIGARETTES_HEIGHT } from '../Cigarettes';
import loadingAnimation from './animation.json';
import swearWords from './swearWords';

interface CigaretteBlockProps extends ViewProps {
	cigarettes: number;
	frequency?: Frequency;
	loading?: boolean;
}

const styles = StyleSheet.create({
	animationContainer: {
		display: 'flex',
		height: scale(CIGARETTES_HEIGHT),
		justifyContent: 'flex-end',
	},
	cigarettesCount: {
		color: theme.primaryColor,
	},
	lottie: {
		backgroundColor: theme.backgroundColor,
	},
	shit: {
		...theme.shitText,
		marginTop: theme.spacing.normal,
	},
});

function getSwearWord(cigaretteCount: number): string {
	if (cigaretteCount <= 1) return t('home_cigarettes_oh');

	// Return a random swear word
	return swearWords[Math.floor(Math.random() * swearWords.length)];
}

function renderAnimation(): React.ReactElement {
	return (
		<View style={styles.animationContainer}>
			<LottieView
				autoPlay
				autoSize
				source={loadingAnimation}
				style={styles.lottie}
			/>
		</View>
	);
}

export function CigaretteBlock(props: CigaretteBlockProps): React.ReactElement {
	const { cigarettes, frequency, loading, style, ...rest } = props;

	// Decide on a swear word. The effect says that the swear word only changes
	// when the cigarettes count changes.
	const [swearWord, setSwearWord] = useState(getSwearWord(cigarettes));
	useEffect(() => {
		setSwearWord(getSwearWord(cigarettes));
	}, [cigarettes]);

	const renderCigarettesText = (): React.ReactElement => {
		if (loading) {
			// FIXME i18n
			return (
				<Text style={styles.shit}>
					Loading<Text style={styles.cigarettesCount}>...{'\n'}</Text>
				</Text>
			);
		}

		// Round to 1 decimal
		const cigarettesRounded = Math.round(cigarettes * 10) / 10;

		const text = t('home_cigarettes_smoked_cigarette_title', {
			swearWord,
			presentPast: t('home_cigarettes_you_smoke'),
			singularPlural:
				cigarettesRounded === 1
					? t('home_cigarettes_cigarette').toLowerCase()
					: t('home_cigarettes_cigarettes').toLowerCase(),
			cigarettes: cigarettesRounded,
		});

		const [firstPartText, secondPartText] = text.split('<');

		return (
			<Text style={styles.shit}>
				{firstPartText}
				<Text style={styles.cigarettesCount}>
					{secondPartText.split('>')[0]}
				</Text>
				{secondPartText.split('>')[1]} {frequency}
			</Text>
		);
	};

	return (
		<View style={[theme.withPadding, style]} {...rest}>
			{loading ? (
				renderAnimation()
			) : (
				<Cigarettes cigarettes={cigarettes} />
			)}
			{renderCigarettesText()}
		</View>
	);
}
