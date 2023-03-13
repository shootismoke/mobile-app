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

import { convert, Pollutant, ugm3 } from '@shootismoke/convert';
import { getDominantPol, OpenAQResults } from '@shootismoke/dataproviders';
import locationIcon from '@shootismoke/ui/assets/images/location.png';
import { formatDistanceToNow } from 'date-fns';
import React, { useContext } from 'react';
import {
	GestureResponderEvent,
	Image,
	ImageRequireSource,
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	View,
} from 'react-native';

import { BackButton, CurrentLocation } from '../../../components';
import { t } from '../../../localization';
import { ApiContext, CurrentLocationContext } from '../../../stores';
import * as theme from '../../../util/theme';

interface HeaderProps {
	onBackClick: (event: GestureResponderEvent) => void;
}

const styles = StyleSheet.create({
	backButton: {
		marginBottom: theme.spacing.normal,
	},
	changeLocation: {
		marginRight: theme.spacing.normal,
	},
	container: {
		...theme.elevationShadowStyle(2, 'bottom'),
		...theme.withPadding,
		backgroundColor: 'white',
		paddingBottom: theme.spacing.small,
		paddingTop: theme.spacing.normal,
		zIndex: 1,
	},
	content: {
		flex: 1,
	},
	currentLocation: {
		marginBottom: theme.spacing.normal,
	},
	info: {
		...theme.text,
		marginVertical: 5,
	},
	label: {
		color: theme.colors.orange,
		fontFamily: theme.Montserrat800,
	},
	layout: {
		flexDirection: 'row',
	},
	pollutantItem: {
		flexBasis: '45%',
	},
	pollutants: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: theme.spacing.normal,
	},
});

const renderInfo = (
	label: string,
	value: string | number,
	style?: StyleProp<TextStyle>
): React.ReactElement => {
	return (
		<Text key={label} style={[styles.info, style]}>
			<Text style={styles.label}>{label}</Text> {value}
		</Text>
	);
};

/**
 * Represents the average value of a pollutant.
 */
type PollutantAverage = Record<
	Pollutant,
	{ values: number[]; average: number }
>;

/**
 * The API returns multiple normalized entries for each pollutant, we calculate
 * the average for each pollutant.
 *
 * @param results - The normalized data in OpenAQResult format.
 */
function pollutantAverage(results: OpenAQResults): PollutantAverage {
	return results.reduce((acc, entry) => {
		if (!acc[entry.parameter]) {
			acc[entry.parameter] = {
				average: entry.value,
				values: [entry.value],
			};
		} else {
			const values = [...acc[entry.parameter].values, entry.value];
			const average = Math.round(
				values.reduce((a, b) => a + b) / values.length
			);
			acc[entry.parameter] = {
				average,
				values,
			};
		}

		return acc;
	}, {} as PollutantAverage);
}

export function Header(props: HeaderProps): React.ReactElement {
	const { onBackClick } = props;
	const { api } = useContext(ApiContext);
	const { currentLocation } = useContext(CurrentLocationContext);

	if (!currentLocation) {
		throw new Error(
			'Details/Header/Header.tsx only render when `currentLocation` is defined.'
		);
	} else if (!api) {
		throw new Error(
			'Details/Header/Header.tsx only render when `api` is defined.'
		);
	}

	// Given all the normalized data from different close stations, calculate
	// the average AQI of each pollutant.
	// FIXME Make sure the units are correctly converted.
	const averages = pollutantAverage(api.results);

	return (
		<View style={styles.container}>
			<BackButton onPress={onBackClick} style={styles.backButton} />

			<View style={styles.layout}>
				<Image
					source={locationIcon as ImageRequireSource}
					style={styles.changeLocation}
				/>

				<View style={styles.content}>
					<CurrentLocation
						currentLocation={currentLocation}
						measurement={api.pm25}
						style={styles.currentLocation}
					/>
					{renderInfo(
						t('details_header_latest_update_label'),
						t('details_header_latest_update_ago', {
							time: formatDistanceToNow(
								new Date(api.pm25.date.local)
							),
						})
					)}
					{renderInfo(
						t('details_header_primary_pollutant_label'),
						getDominantPol(api.results).toUpperCase()
					)}

					<View style={styles.pollutants}>
						{Object.keys(averages).map((pollutant) => {
							return renderInfo(
								`${pollutant.toUpperCase()} AQI:`,
								convert(
									pollutant as Pollutant,
									ugm3,
									'usaEpa',
									averages[pollutant as Pollutant].average
								),
								styles.pollutantItem
							);
						})}
					</View>
				</View>
			</View>
		</View>
	);
}
