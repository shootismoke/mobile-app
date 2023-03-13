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
import { StyleSheet, Text } from 'react-native';

import { Banner } from '../../../components';
import { t } from '../../../localization';
import { useDistanceUnit } from '../../../stores/distanceUnit';
import * as theme from '../../../util/theme';

interface DistanceProps {
	distance: number;
}

const styles = StyleSheet.create({
	banner: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	distance: {
		...theme.title,
		color: 'white',
	},
});

export function Distance(props: DistanceProps): React.ReactElement {
	const { localizedDistanceUnit } = useDistanceUnit();
	const distanceUnit = localizedDistanceUnit('short');

	return (
		<Banner elevated shadowPosition="top" style={styles.banner}>
			<Text style={styles.distance}>
				{t('details_distance_label', {
					distanceToStation: props.distance,
					distanceUnit,
				}).toUpperCase()}
			</Text>
		</Banner>
	);
}
