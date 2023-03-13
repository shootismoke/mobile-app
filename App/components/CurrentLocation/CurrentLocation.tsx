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

import { OpenAQResult, stationName } from '@shootismoke/dataproviders';
import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { t } from '../../localization';
import { Location } from '../../stores/util/fetchGpsPosition';
import * as theme from '../../util/theme';

const UNKNOWN_STATION = t('current_location_unknown_station');

interface CurrentLocationProps extends TextProps {
	measurement: OpenAQResult;
	currentLocation: Location;
}

const styles = StyleSheet.create({
	title: {
		...theme.title,
	},
});

export function CurrentLocation(
	props: CurrentLocationProps
): React.ReactElement {
	const { currentLocation, measurement, style, ...rest } = props;

	return (
		<Text style={[styles.title, style]} {...rest}>
			{(
				currentLocation.name ||
				stationName(measurement) ||
				UNKNOWN_STATION
			).toUpperCase()}
		</Text>
	);
}
