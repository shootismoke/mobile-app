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

import Constants from 'expo-constants';
import { Platform, ViewStyle } from 'react-native';
import { scale } from 'react-native-size-matters';

export type ShadowPosition = 'top' | 'bottom';

// Colors.
export const colors = {
	gray200: '#CCCFD4',
	gray600: '#646973',
	gray700: '#3D3F42',
	white: '#FFFFFF',
	cream: '#F7F0DF',
	gold: '#E5D98D',
	orange: '#F2934E',
	red: '#FF5139',
};

export const backgroundColor = '#FAFAFC';
export const iconBackgroundColor = '#EBE7DD';

/**
 * @deprecated Use 500 instead.
 */
export const Montserrat400 = 'Montserrat400';
export const Montserrat500 = 'Montserrat500';
export const Montserrat800 = 'Montserrat800';

// Typography.
export const typography = {
	type700: {
		fontFamily: Montserrat800,
		fontSize: scale(48),
		fontWeight: '800' as const,
		lineHeight: scale(54),
		letterSpacing: scale(-3),
	},
	type600: {
		fontFamily: Montserrat800,
		fontSize: scale(36),
		fontWeight: '800' as const,
		lineHeight: scale(42),
		letterSpacing: scale(-3),
	},
	type500: {
		fontFamily: Montserrat800,
		fontSize: scale(24),
		fontWeight: '800' as const,
		lineHeight: scale(28),
		letterSpacing: scale(-1),
	},
	type400: {
		fontFamily: Montserrat800,
		fontSize: scale(18),
		fontWeight: '800' as const,
		lineHeight: scale(21.94),
		letterSpacing: scale(-1),
	},
	type300: {
		fontFamily: Montserrat800,
		fontSize: scale(12),
		fontWeight: '800' as const,
		lineHeight: scale(14.63),
		letterSpacing: scale(2),
	},
	type200: {
		fontFamily: Montserrat500,
		fontSize: scale(14),
		fontWeight: '500' as const,
		lineHeight: scale(17.07),
	},
	type100: {
		fontFamily: Montserrat500,
		fontSize: scale(12),
		fontWeight: '500' as const,
		lineHeight: scale(20),
	},
};

// Spacing.
export const spacing = {
	tiny: scale(5),
	mini: scale(10),
	small: scale(15),
	normal: scale(20),
	big: scale(36),
	huge: scale(48),
};

/**
 * The Gotham font seems like not 100% aligned vertically in the middle,even
 * when everything's configured in the middle, just remove this and see for
 * youself.
 * FIXME
 */
const fixTextMargin = {
	...Platform.select({
		ios: {
			marginTop: scale(3),
		},
	}),
};

/**
 * Get consistent shadows between iOS and Android
 * @see https://stenbeck.io/styling-shadows-in-react-native-ios-and-android/
 */
export function elevationShadowStyle(
	elevation: number,
	position: ShadowPosition = 'bottom'
): ViewStyle {
	return {
		elevation,
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: scale((position === 'bottom' ? 1 : -1) * elevation),
		},
		shadowOpacity: 0.3,
		shadowRadius: scale(0.8 * elevation),
	};
}

export const fullScreen = {
	backgroundColor,
	flexGrow: 1,
	paddingTop: Constants.statusBarHeight,
};

/**
 * @deprecated Use Typography instead.
 */
export const link = {
	color: colors.orange,
	fontFamily: Montserrat500,
	textDecorationLine: 'underline' as const,
};

/**
 * Big text with "Sh*t! I smoked...""
 * @deprecated Use Typography instead.
 */
export const shitText = {
	color: colors.gray700,
	fontFamily: Montserrat800,
	fontSize: scale(31),
	letterSpacing: scale(-1),
	lineHeight: scale(36),
	...fixTextMargin,
};

/**
 * Normal text.
 * @deprecated Use Typography instead.
 */
export const text = {
	color: colors.gray600,
	fontFamily: Montserrat500,
	fontSize: scale(11),
	letterSpacing: scale(0.85),
	lineHeight: scale(15),
};

/**
 * @deprecated Use Typography instead.
 */
export const title = {
	letterSpacing: scale(3.14),
	lineHeight: scale(18),
	color: colors.gray700,
	fontFamily: Montserrat800,
	fontSize: scale(12),
	...fixTextMargin,
};

/**
 * @deprecated Use Typography instead.
 */
export const withLetterSpacing = {
	letterSpacing: scale(2),
};

export const withPadding = {
	paddingHorizontal: spacing.normal,
};
