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

import React from 'react';
import {
	Image,
	ImageSourcePropType,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';

import butt from '@shootismoke/ui/assets/images/butt.png';
import buttVertical from '@shootismoke/ui/assets/images/butt-vertical.png';
import head from '@shootismoke/ui/assets/images/head.png';
import headVertical from '@shootismoke/ui/assets/images/head-vertical.png';

export type CigaretteOrientation = 'diagonal' | 'horizontal' | 'vertical';

interface CigaretteProps {
	percentage: number;
	orientation: CigaretteOrientation;
	fullCigaretteLength: number;
	style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
	butt: {
		bottom: 0,
		position: 'absolute',
		left: 0,
	},
	cigarette: {
		flexGrow: 1,
	},
	diagonal: {
		transform: [{ rotate: '45deg' }, { scale: 1 }],
	},
	head: {
		position: 'absolute',
		right: 0,
		top: 0,
		zIndex: 1,
	},
	inner: {
		bottom: 0,
		left: 0,
		overflow: 'hidden',
		position: 'absolute',
	},
});

/**
 * The percentage of cigarette length when `percentage=0`.
 */
const MIN_PERCENTAGE = 0.4;

/**
 * Given the full length of a cigarette, and the percentage of the cigarette
 * smoked, get the actual length of the cigarette.
 */
function getCigaretteActualLength(
	fullCigaretteLength: number,
	percentage: number
): number {
	return Math.ceil(
		((1 - MIN_PERCENTAGE) * percentage + MIN_PERCENTAGE) *
			fullCigaretteLength
	);
}

/**
 * A cigarette's width:height aspect ratio.
 */
const CIGARETTE_ASPECT_RATIO = 21 / 280;
const CIGARETTE_HEAD_HW_RATIO = 27 / 20;

function getContainerStyle(
	orientation: CigaretteOrientation,
	fullCigaretteLength: number
): ViewStyle {
	// Assuming the cigarette is vertical:
	const height = fullCigaretteLength;
	const width = height * CIGARETTE_ASPECT_RATIO;

	switch (orientation) {
		case 'horizontal': {
			return {
				height: width,
				width: height,
			};
		}
		case 'vertical': {
			return {
				height: height,
				width: width,
			};
		}
		default:
			return {};
	}
}

/**
 * Render a horizontal or vertical cigarette.
 */
function renderCigarette(
	orientation: 'horizontal' | 'vertical',
	percentage: number,
	fullCigaretteLength: number,
	additionalStyle?: StyleProp<ViewStyle>
): React.ReactElement {
	// Assuming cigarette is vertical:
	const height = fullCigaretteLength;
	const width = height * CIGARETTE_ASPECT_RATIO;
	const actualHeight = getCigaretteActualLength(
		fullCigaretteLength,
		percentage
	);

	return (
		<View
			style={[
				getContainerStyle(orientation, fullCigaretteLength),
				additionalStyle,
			]}
		>
			<View
				style={[
					styles.inner,
					orientation === 'horizontal'
						? {
								height: '100%',
								width: actualHeight,
						  }
						: {
								height: actualHeight,
								width: '100%',
						  },
				]}
			>
				<Image
					source={
						(orientation === 'vertical'
							? buttVertical
							: butt) as ImageSourcePropType
					}
					style={[
						styles.butt,
						orientation === 'horizontal'
							? {
									height: '100%',
									width: fullCigaretteLength,
							  }
							: {
									height: fullCigaretteLength,
									width: '100%',
							  },
					]}
				/>
				<Image
					source={
						(orientation === 'vertical'
							? headVertical
							: head) as ImageSourcePropType
					}
					style={[
						styles.head,
						orientation === 'horizontal'
							? {
									height: '100%',
									width: width * CIGARETTE_HEAD_HW_RATIO,
							  }
							: {
									height: width * CIGARETTE_HEAD_HW_RATIO,
									width: '100%',
							  },
					]}
				/>
			</View>
		</View>
	);
}

export function Cigarette(props: CigaretteProps): React.ReactElement {
	const { orientation, percentage, fullCigaretteLength, style } = props;

	// Only used for diagonal. Assuming cigarette is vertical:
	const height = getCigaretteActualLength(fullCigaretteLength, percentage);
	const width = fullCigaretteLength * CIGARETTE_ASPECT_RATIO;

	// For diagonal cigarettes, we render a horizontal cigarette, and rotate it
	// 45deg.
	return orientation === 'diagonal' ? (
		<View
			style={[
				{
					height: (height + width) / Math.SQRT2,
					width: (height + width) / Math.SQRT2,
				},
				style,
			]}
		>
			<View style={styles.diagonal}>
				{renderCigarette('horizontal', percentage, fullCigaretteLength)}
			</View>
		</View>
	) : (
		renderCigarette(orientation, percentage, fullCigaretteLength, style)
	);
}
