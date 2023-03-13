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

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React from 'react';
import {
	Linking,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ScrollIntoView, wrapScrollView } from 'react-native-scroll-into-view';
import { scale } from 'react-native-size-matters';
import { DistanceUnit } from '@shootismoke/ui';

import { ConversionBox, BackButton } from '../../components';
import { t } from '../../localization';
import { useDistanceUnit } from '../../stores/distanceUnit';
import { AmplitudeEvent, track, trackScreen } from '../../util/amplitude';
import * as theme from '../../util/theme';
import { sentryError } from '../../util/sentry';
import { RootStackParams } from '../routeParams';

const CustomScrollView = wrapScrollView(ScrollView);
const scrollViewOptions = {
	align: 'top' as const,
	insets: {
		bottom: 0,
		top: scale(theme.spacing.normal),
	},
};

export const aboutSections = {
	aboutBetaInaccurate: 'aboutBetaInaccurate',
	aboutWhyIsTheStationSoFarTitle: 'aboutWhyIsTheStationSoFarTitle',
};

const openAmaury = (): void => {
	Linking.openURL('https://amaurym.com').catch(sentryError('About'));
};

const openWaqi = (): void => {
	Linking.openURL('https://aqicn.org').catch(sentryError('About'));
};

const openOpenAQ = (): void => {
	Linking.openURL('https://openaq.org').catch(sentryError('About'));
};

const openBerkeley = (): void => {
	Linking.openURL(
		'http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/'
	).catch(sentryError('About'));
};

const openGithub = (): void => {
	Linking.openURL('https://github.com/shootismoke/mobile-app').catch(
		sentryError('About')
	);
};

const openMarcelo = (): void => {
	Linking.openURL('https://www.behance.net/marceloscoelho').catch(
		sentryError('About')
	);
};

const openPrivacy = (): void => {
	Linking.openURL(
		'https://github.com/shootismoke/policies/blob/main/privacy/index.md'
	).catch(sentryError('About'));
};

const openTerms = (): void => {
	Linking.openURL(
		'https://github.com/shootismoke/policies/blob/main/terms/index.md'
	).catch(sentryError('About'));
};

interface AboutProps {
	navigation: StackNavigationProp<RootStackParams, 'About'>;
	route: RouteProp<RootStackParams, 'About'>;
}

const styles = StyleSheet.create({
	articleLink: {
		...theme.text,
		fontSize: scale(8),
	},
	backButton: {
		marginBottom: theme.spacing.normal,
		marginTop: theme.spacing.normal,
	},
	credits: {
		borderTopColor: theme.iconBackgroundColor,
		borderTopWidth: 1,
		marginBottom: theme.spacing.normal,
		paddingTop: theme.spacing.big,
	},
	distance: {
		borderTopColor: theme.iconBackgroundColor,
		borderTopWidth: 1,
		marginBottom: theme.spacing.big,
		paddingTop: theme.spacing.big,
	},
	distancePicker: {
		...Platform.select({
			ios: {
				marginBottom: scale(-60),
				marginTop: scale(-40),
			},
		}),
	},
	distanceText: {
		...theme.text,
		fontSize: scale(14),
		paddingLeft: theme.spacing.small,
		textTransform: 'capitalize',
	},
	h2: {
		...theme.title,
		fontSize: scale(20),
		letterSpacing: 0,
		lineHeight: scale(24),
		marginBottom: theme.spacing.small,
	},
	micro: {
		...Platform.select({
			ios: {
				fontFamily: 'Georgia',
			},
			android: {
				fontFamily: 'normal',
			},
		}),
	},
	section: {
		marginBottom: theme.spacing.big,
	},
});

export function About(props: AboutProps): React.ReactElement {
	const {
		navigation: { goBack },
		route,
	} = props;
	const { distanceUnit, setDistanceUnit } = useDistanceUnit();

	trackScreen('ABOUT');

	return (
		<CustomScrollView
			scrollIntoViewOptions={scrollViewOptions}
			style={theme.withPadding}
		>
			<BackButton onPress={goBack} style={styles.backButton} />

			<View style={styles.section}>
				<Text style={styles.h2}>
					{t(
						'about_how_do_you_calculate_the_number_of_cigarettes_title'
					)}
				</Text>
				<Text style={theme.text}>
					{t(
						'about_how_do_you_calculate_the_number_of_cigarettes_message_1'
					)}
					<Text onPress={openBerkeley} style={theme.link}>
						{t(
							'about_how_do_you_calculate_the_number_of_cigarettes_link_1'
						)}
					</Text>
					{t(
						'about_how_do_you_calculate_the_number_of_cigarettes_message_2'
					)}
					<Text style={styles.micro}>&micro;</Text>
					g/m&sup3;
					{' \u207D'}
					&sup1;
					{'\u207E'}.
				</Text>
				<ConversionBox showFootnote={true} />
				<Text style={styles.articleLink}>
					(1){' '}
					<Text onPress={openBerkeley} style={theme.link}>
						http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
					</Text>
				</Text>
			</View>

			<ScrollIntoView
				onMount={route.params?.scrollInto === 'aboutBetaInaccurate'}
				style={styles.section}
			>
				<Text style={styles.h2}>
					{t('about_beta_inaccurate_title')}
				</Text>
				<Text style={theme.text}>
					{t('about_beta_inaccurate_message')}
				</Text>
			</ScrollIntoView>

			<View style={styles.section}>
				<Text style={styles.h2}>
					{t('about_where_does_data_come_from_title')}
				</Text>
				<Text style={theme.text}>
					{t('about_where_does_data_come_from_message_1')}
					<Text onPress={openWaqi} style={theme.link}>
						{t('about_where_does_data_come_from_link_1')}
					</Text>
					{t('about_where_does_data_come_from_message_2')}
					<Text onPress={openOpenAQ} style={theme.link}>
						{t('about_where_does_data_come_from_link_2')}
					</Text>
					{t('about_where_does_data_come_from_message_3')}
				</Text>
			</View>

			<ScrollIntoView
				onMount={
					route.params?.scrollInto ===
					'aboutWhyIsTheStationSoFarTitle'
				}
				style={styles.section}
			>
				<Text style={styles.h2}>
					{t('about_why_is_the_station_so_far_title')}
				</Text>
				<Text style={theme.text}>
					{t('about_why_is_the_station_so_far_message')}
				</Text>
			</ScrollIntoView>

			<View style={styles.section}>
				<Text style={styles.h2}>{t('about_weird_results_title')}</Text>
				<Text style={theme.text}>
					{t('about_weird_results_message_1')}
					<Text onPress={openWaqi} style={theme.link}>
						{t('about_weird_results_link_1')}
					</Text>
					{t('about_weird_results_message_2')}
					<Text onPress={openOpenAQ} style={theme.link}>
						{t('about_weird_results_link_2')}
					</Text>
					{t('about_weird_results_message_3')}
				</Text>
			</View>

			<View style={styles.distance}>
				<Text style={styles.h2}>{t('about_settings_title')}</Text>
				<Text style={theme.text}>
					{t('about_settings_distance_unit')}
				</Text>
				<Picker
					onValueChange={(value: DistanceUnit): void => {
						track(
							`ABOUT_SCREEN_SETTINGS_${value.toUpperCase()}` as AmplitudeEvent
						);
						setDistanceUnit(value);
					}}
					selectedValue={distanceUnit}
					style={styles.distancePicker}
				>
					<Picker.Item
						label={t('about_settings_distance_unit_km')}
						value="km"
					/>
					<Picker.Item
						label={t('about_settings_distance_unit_mile')}
						value="mile"
					/>
				</Picker>
			</View>

			<View style={styles.credits}>
				<Text style={styles.h2}>{t('about_credits_title')}</Text>
				<Text style={theme.text}>
					{t('about_credits_concept_and_development')}{' '}
					<Text onPress={openAmaury} style={theme.link}>
						Amaury M
					</Text>
					.{'\n'}
					{t('about_credits_design_and_copywriting')}{' '}
					<Text onPress={openMarcelo} style={theme.link}>
						Marcelo S. Coelho
					</Text>
					.{'\n'}
					{'\n'}
					{t('about_credits_data_from_message_1')}
					<Text onPress={openWaqi} style={theme.link}>
						{t('about_credits_data_from_link_1')}
					</Text>
					{t('about_credits_data_from_message_2')}
					<Text onPress={openOpenAQ} style={theme.link}>
						{t('about_credits_data_from_link_2')}
					</Text>
					.{'\n'}
					{t('about_credits_source_code')}
					<Text onPress={openGithub} style={theme.link}>
						{t('about_credits_available_github')}
					</Text>
					.{'\n'}
					{'\n'}
					{Constants.expoConfig?.name} v
					{Constants.expoConfig?.version}. See{' '}
					<Text onPress={openTerms} style={theme.link}>
						Terms of Service
					</Text>{' '}
					and{' '}
					<Text onPress={openPrivacy} style={theme.link}>
						Privacy Policy
					</Text>
					.
				</Text>
				{/* Add changing languages https://github.com/shootismoke/mobile-app/issues/73 */}
			</View>
		</CustomScrollView>
	);
}
