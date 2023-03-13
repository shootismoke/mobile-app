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

import Ionicons from '@expo/vector-icons/build/Ionicons';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { scale } from 'react-native-size-matters';

import { Button, ButtonProps } from '../Button';
import * as theme from '../../util/theme';

interface CircleButtonProps extends ButtonProps {
	icon?: string;
	inverted?: boolean;
	text?: string;
}

const styles = StyleSheet.create({
	circle: {
		height: scale(36),
		paddingVertical: 0,
		width: scale(36),
	},
	invertedCircle: {
		backgroundColor: theme.colors.orange,
		borderWidth: 0,
	},
	label: {
		...theme.title,
		color: theme.colors.orange,
		fontSize: scale(9),
		letterSpacing: 0,
	},
});

/**
 * Decide whether we show an icon or a text
 */
function renderIconOrText(
	icon?: string,
	inverted?: boolean,
	text?: string
): React.ReactElement | undefined {
	return icon ? (
		<Ionicons
			color={inverted ? 'white' : theme.colors.orange}
			name={icon as 'body'} // FIXME Typings are really not optimal here, `icon` is obviously a string, but using 'body' to make TS happy.
			size={scale(22)}
		/>
	) : text ? (
		<Text style={styles.label}>{text}</Text>
	) : undefined;
}

export function CircleButton(props: CircleButtonProps): React.ReactElement {
	const { icon, inverted, style, text, ...rest } = props;

	return (
		<Button
			style={[
				styles.circle,
				inverted ? styles.invertedCircle : undefined,
				style,
			]}
			{...rest}
		>
			{renderIconOrText(icon, inverted, text)}
		</Button>
	);
}
