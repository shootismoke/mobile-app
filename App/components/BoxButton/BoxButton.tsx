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
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	TouchableWithoutFeedbackProps,
	View,
} from 'react-native';

import * as theme from '../../util/theme';

interface BoxButtonProps extends TouchableWithoutFeedbackProps {
	active?: boolean;
	children: string | JSX.Element;
}

const styles = StyleSheet.create({
	activeText: {
		color: theme.colors.gray700,
	},
	boxButton: {
		...theme.elevationShadowStyle(3),
		backgroundColor: 'white',
		borderColor: 'rgba(0, 0, 0, 0.1)',
		borderRadius: 12,
		borderWidth: 1,
		marginBottom: theme.spacing.mini,
		paddingHorizontal: theme.spacing.small,
		paddingVertical: 6, // Padding for the shadow
		shadowOpacity: 0.1,
	},
	boxButtonText: {
		...theme.shitText,
		color: theme.colors.gray200,
		textAlign: 'center',
	},
});

export function BoxButton(props: BoxButtonProps): React.ReactElement {
	const { active, children, onPress, style, ...rest } = props;

	return (
		<TouchableWithoutFeedback onPress={onPress} {...rest}>
			<View style={[styles.boxButton, style]}>
				{typeof children === 'string' ? (
					<Text
						style={[
							styles.boxButtonText,
							active ? styles.activeText : undefined,
						]}
					>
						{children}
					</Text>
				) : (
					children
				)}
			</View>
		</TouchableWithoutFeedback>
	);
}
