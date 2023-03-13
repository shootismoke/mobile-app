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

import LottieView from 'lottie-react-native';
import React from 'react';
import {
	StyleSheet,
	View,
	ViewProps,
	StyleProp,
	ViewStyle,
} from 'react-native';
import type { Frequency } from '@shootismoke/ui';
import { Cigarettes, CigarettesProps } from '../Cigarettes';

import * as theme from '../../util/theme';
import loadingAnimation from './animation.json';
import { CigarettesText } from '../CigarettesText';

export interface CigarettesBlockProps extends ViewProps, CigarettesProps {
	/**
	 * If set, will show the frequency in the text.
	 */
	frequency?: Frequency;
	/**
	 * Style of the inner cigarette block.
	 */
	cigarettesStyle?: StyleProp<ViewStyle>;
	/**
	 * Show lottie animation while loading.
	 */
	loading?: boolean;
	/**
	 * Style of the inner cigarette block.
	 */
	textStyle?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
	animationContainer: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	shitText: {
		marginTop: theme.spacing.normal,
	},
});

function renderAnimation(
	cigarettesStyle: StyleProp<ViewProps>
): React.ReactElement {
	return (
		<View style={[styles.animationContainer, cigarettesStyle]}>
			<LottieView autoPlay autoSize source={loadingAnimation} />
		</View>
	);
}

export function CigarettesBlock(
	props: CigarettesBlockProps
): React.ReactElement {
	const {
		cigarettes,
		cigarettesStyle,
		fullCigaretteLength,
		frequency,
		loading,
		showMaxCigarettes,
		showVerticalAfter,
		spacingVertical,
		spacingHorizontal,
		textStyle,
		...rest
	} = props;

	return (
		<View {...rest}>
			{loading ? (
				renderAnimation(cigarettesStyle)
			) : (
				<Cigarettes
					cigarettes={cigarettes}
					fullCigaretteLength={fullCigaretteLength}
					showMaxCigarettes={showMaxCigarettes}
					showVerticalAfter={showVerticalAfter}
					spacingVertical={spacingVertical}
					spacingHorizontal={spacingHorizontal}
					style={cigarettesStyle}
				/>
			)}
			<CigarettesText
				cigarettes={cigarettes}
				frequency={frequency}
				loading={loading}
				style={[styles.shitText, textStyle]}
			/>
		</View>
	);
}
