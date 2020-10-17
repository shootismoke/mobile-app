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

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React from 'react';
import {
	Linking,
	Picker,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { ScrollIntoView, wrapScrollView } from 'react-native-scroll-into-view';
import { scale } from 'react-native-size-matters';
import { Trans, useTranslation } from 'react-i18next';
import { DistanceUnit } from '@shootismoke/ui';

import { BackButton } from '../../components';
// import { t } from '../../localization';
import { useDistanceUnit } from '../../stores/distanceUnit';
import { AmplitudeEvent, track, trackScreen } from '../../util/amplitude';
import * as theme from '../../util/theme';
import { sentryError } from '../../util/sentry';
import { RootStackParams } from '../routeParams';
import { Box } from './Box';


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

const handleOpenAmaury = (): void => {
	Linking.openURL('https://twitter.com/amaurymartiny').catch(
		sentryError('About')
	);
};

const handleOpenWaqi = (): void => {
	Linking.openURL('https://aqicn.org').catch(sentryError('About'));
};

const handleOpenOpenAQ = (): void => {
	Linking.openURL('https://openaq.org').catch(sentryError('About'));
};

const handleOpenBerkeley = (): void => {
	Linking.openURL(
		'http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/'
	).catch(sentryError('About'));
};

const handleOpenGithub = (): void => {
	Linking.openURL('https://github.com/amaurymartiny/shoot-i-smoke').catch(
		sentryError('About')
	);
};

const handleOpenMarcelo = (): void => {
	Linking.openURL('https://www.behance.net/marceloscoelho').catch(
		sentryError('About')
	);
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
		route
	} = props;
	const { distanceUnit, setDistanceUnit } = useDistanceUnit();
	const { t } = useTranslation('screen_about')

	trackScreen('ABOUT');

	const proportion = `22&micro;g/m&sup3;\u207D&sup1;\u207E` //TODO test if this works

	return (
		<CustomScrollView
			scrollIntoViewOptions={scrollViewOptions}
			style={theme.withPadding}
		>
			<BackButton onPress={goBack} style={styles.backButton} />

			<View style={styles.section}>
				<Text style={styles.h2}>
					{t('how_to_calculate_number_of_cigarettes.title')}
				</Text>
				<Text style={theme.text}>
					<Trans i18nKey='how_to_calculate_number_of_cigarettes.message' values={{ proportion }} t={t}>
						This app was inspired by Berkeley Earth’s findings about the <Text onPress={handleOpenBerkeley} style={theme.link}>equivalence between air pollution and cigarette smoking</Text>. The rule of thumb is simple: one cigarette per day (24h) is the rough equivalent of a PM2.5 level of <Text style={styles.micro}>{'{{proportion}}'}</Text>.
					</Trans>
				</Text>
				<Box />
				<Text style={styles.articleLink}>
					(1){' '}
					<Text onPress={handleOpenBerkeley} style={theme.link}>
						http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
					</Text>
				</Text>
			</View>

			<ScrollIntoView
				onMount={route.params?.scrollInto === 'aboutBetaInaccurate'}
				style={styles.section}
			>
				<Text style={styles.h2}>
					{t('inaccurated_beta.title')}
				</Text>
				<Text style={theme.text}>
					{t('inaccurated_beta.message')}
				</Text>
			</ScrollIntoView>

			<View style={styles.section}>
				<Text style={styles.h2}>
					{t('where_does_data_come_from.title')}
				</Text>
				<Text style={theme.text}>
					<Trans i18nKey='where_does_data_come_from.message' t={t}>
						Air quality data comes from <Text onPress={handleOpenWaqi} style={theme.link}>WAQI</Text> and <Text onPress={handleOpenOpenAQ} style={theme.link}>OpenAQ</Text> in the form of PM2.5 AQI levels which are usually updated every one hour and converted to direct PM2.5 levels by the app.
					</Trans>
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
					{t('why_is_the_station_so_far.title')}
				</Text>
				<Text style={theme.text}>
					{t('why_is_the_station_so_far.message')}
				</Text>
			</ScrollIntoView>

			<View style={styles.section}>
				<Text style={styles.h2}>{t('weird_results.title')}</Text>
				<Text style={theme.text}>
					<Trans i18nKey='weird_results.message' t={t}>
						We have also encountered a few surprising results: large cities with better air than small villages; sudden huge increases in the number of cigarettes; stations of the same town showing significantly different numbers... The fact is air quality depends on several factors such as temperature, pressure, humidity and even wind direction and intensity. If the result seems weird for you, check <Text onPress={handleOpenWaqi} style={theme.link}>WAQI</Text> and <Text onPress={handleOpenOpenAQ} style={theme.link}>OpenAQ</Text> for more information and history on your station.
					</Trans>
				</Text>
			</View>

			<View style={styles.distance}>
				<Text style={styles.h2}>{t('settings_title')}</Text>
				<Text style={theme.text}>
					{t('settings_distance_unit')}
				</Text>
				<Picker
					onValueChange={(value: DistanceUnit): void => {
						track(
							`SCREEN_SETTINGS_${value.toUpperCase()}` as AmplitudeEvent
						);
						setDistanceUnit(value);
					}}
					selectedValue={distanceUnit}
					style={styles.distancePicker}
				>
					<Picker.Item
						label={t('settings_distance_unit_km')}
						value="km"
					/>
					<Picker.Item
						label={t('settings_distance_unit_mile')}
						value="mile"
					/>
				</Picker>
			</View>

			<View style={styles.credits}>
				<Text style={styles.h2}>{t('credits_title')}</Text>
				<Text style={theme.text}>
					{t('credits_concept_and_development')}{' '}
					<Text onPress={handleOpenAmaury} style={theme.link}>
						Amaury Martiny
					</Text>
					.{'\n'}
					{t('credits_design_and_copywriting')}{' '}
					<Text onPress={handleOpenMarcelo} style={theme.link}>
						Marcelo S. Coelho
					</Text>
					.{'\n'}
					{'\n'}
					{t('credits_data_from_message_1')}
					<Text onPress={handleOpenWaqi} style={theme.link}>
						{t('credits_data_from_link_1')}
					</Text>
					{t('credits_data_from_message_2')}
					<Text onPress={handleOpenOpenAQ} style={theme.link}>
						{t('credits_data_from_link_2')}
					</Text>
					.{'\n'}
					{t('credits_source_code')}
					<Text onPress={handleOpenGithub} style={theme.link}>
						{t('credits_available_github')}
					</Text>
					.{'\n'}
					{'\n'}
					{Constants.manifest.name} v
					{Constants.manifest.revisionId ||
						Constants.manifest.version}
					.
				</Text>
				{/* Add changing languages https://github.com/amaurymartiny/shoot-i-smoke/issues/73 */}
			</View>
		</CustomScrollView>
	);
}

// TODO translating
