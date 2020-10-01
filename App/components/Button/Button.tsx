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

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableOpacityProps,
	View,
} from 'react-native';
import { scale } from 'react-native-size-matters';

import * as theme from '../../util/theme';

export interface ButtonProps extends TouchableOpacityProps {
	as?: typeof View; // Give a possibility to show the Button as View instead of TouchableOpacity
	children?: string | React.ReactElement;
	icon?: string;
	type?: 'primary' | 'secondary';
}

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingVertical: theme.spacing.mini,
	},
	buttonText: {
		...theme.title,
		color: theme.primaryColor,
	},
	icon: {
		marginRight: theme.spacing.mini,
	},
	primary: {
		borderColor: theme.primaryColor,
		borderRadius: scale(24),
		borderWidth: scale(2),
	},
});

// FIXME Use component from `@shootismoke/ui`
export function Button(props: ButtonProps): React.ReactElement {
	const {
		as: Wrapper = TouchableOpacity,
		children,
		icon,
		onPress,
		style,
		type = 'primary',
		...rest
	} = props;

	return (
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore FIXME TS doesn't seem to like this construct
		<Wrapper
			onPress={onPress}
			style={[
				styles.button,
				type === 'primary' ? styles.primary : undefined,
				style,
			]}
			{...rest}
		>
			{icon && (
				<Ionicons
					color={theme.primaryColor}
					name={icon}
					size={15}
					style={children ? styles.icon : undefined}
				/>
			)}
			{children &&
				(typeof children === 'string' ? (
					<Text style={styles.buttonText}>{children}</Text>
				) : (
					children
				))}
		</Wrapper>
	);
}
