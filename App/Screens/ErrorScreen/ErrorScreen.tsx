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
import { StackNavigationProp } from '@react-navigation/stack';
import errorPicture from '@shootismoke/ui/assets/images/error.png';
import React, { useContext, useEffect, useState } from 'react';
import {
	Image,
	ImageRequireSource,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { Button } from '../../components';
import { t } from '../../localization';
import { ErrorContext } from '../../stores';
import { track, trackScreen } from '../../util/amplitude';
import { sentryError } from '../../util/sentry';
import { testIds } from '../../util/testId';
import * as theme from '../../util/theme';
import { ErrorStackParams } from '../routeParams';

interface ErrorScreenProps {
	navigation: StackNavigationProp<ErrorStackParams, 'Error'>;
}

const styles = StyleSheet.create({
	chooseOther: {
		marginVertical: theme.spacing.normal,
	},
	container: {
		...theme.fullScreen,
		...theme.withPadding,
		flexGrow: 1,
		flexDirection: 'column',
	},
	errorMessage: {
		...theme.text,
	},
	errorScrollView: {
		flex: 1,
		marginVertical: theme.spacing.small,
	},
	errorText: {
		...theme.shitText,
		marginTop: theme.spacing.big,
	},
	sorry: {
		color: theme.colors.orange,
	},
});

export function ErrorScreen(props: ErrorScreenProps): React.ReactElement {
	const { error } = useContext(ErrorContext);
	const [showDetails, setShowDetails] = useState(false);

	trackScreen('ERROR');

	useEffect(() => {
		if (error) {
			sentryError('ErrorScreen')(error);
		}
	}, [error]);

	return (
		<View style={styles.container} testID={testIds.Error.screen}>
			<Image source={errorPicture as ImageRequireSource} />
			<View>
				<Text style={styles.errorText}>
					<Text style={styles.sorry}>
						{t('error_screen_common_sorry')}
					</Text>
					{t('error_screen_error_cannot_load_cigarettes')}
				</Text>
			</View>
			<Button
				onPress={(): void => {
					track('ERROR_SCREEN_CHANGE_LOCATION_CLICK');
					props.navigation.navigate('Search');
				}}
				style={styles.chooseOther}
				type="primary"
			>
				{t('error_screen_choose_other_location').toUpperCase()}
			</Button>
			<Text style={theme.text}>
				{t('error_screen_error_description')}
			</Text>
			<ScrollView style={styles.errorScrollView}>
				<TouchableOpacity
					onPress={(): void => setShowDetails(!showDetails)}
					testID={testIds.Error.showDetails}
				>
					{showDetails ? (
						<Text style={styles.errorMessage}>
							{t('error_screen_error_message', {
								errorText: error && error.message,
							})}
						</Text>
					) : (
						<Text style={styles.errorMessage}>
							{t('error_screen_show_details')}{' '}
							<Ionicons name="ios-arrow-forward" />
						</Text>
					)}
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
}
