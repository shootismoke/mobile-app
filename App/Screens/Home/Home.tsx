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

import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CigarettesBlock, Frequency, FrequencyContext } from '@shootismoke/ui';
import { scale } from 'react-native-size-matters';

import { t } from '../../localization';
import { ApiContext, CurrentLocationContext } from '../../stores';
import { track, trackScreen } from '../../util/amplitude';
import * as theme from '../../util/theme';
import { RootStackParams } from '../routeParams';
import { AdditionalInfo } from './AdditionalInfo';
import { Footer } from './Footer';
import { Header } from './Header';
import { SelectFrequency } from './SelectFrequency';
import { SmokeVideo } from './SmokeVideo';

interface HomeProps {
	navigation: StackNavigationProp<RootStackParams, 'Home'>;
}

/**
 * Thresholds on cigarettes count to show different cigarettes sizes.
 */
const THRESHOLD = {
	FIRST: 0.2,
	SECOND: 1,
	THIRD: 4,
	FOURTH: 14,
};

/**
 * Sizes of different cigarettes.
 */
const SIZES = {
	BIG: 180,
	MEDIUM: 90,
	SMALL: 41,
};

/**
 * Depending on cigarettes sizes, get correct margins.
 */
function getCigarettesMargin(count: number): number {
	return scale(
		count <= THRESHOLD.THIRD ? 9 : count <= THRESHOLD.FOURTH ? 6 : 3
	);
}

const styles = StyleSheet.create({
	cigarettes: {
		height: scale(SIZES.MEDIUM),
	},
	container: {
		flexGrow: 1,
	},
	footer: {
		marginBottom: theme.spacing.big,
	},
	scroll: {
		flex: 1,
	},
	withMargin: {
		marginTop: theme.spacing.normal,
	},
});

interface Cigarettes {
	/**
	 * The current number of cigarettes shown on this Home screen
	 */
	count: number;
	/**
	 * Denotes whether the cigarette count is exact or not. It's usually exact.
	 * The only case where it's not exact, it's when we fetch weekly/monthly
	 * cigarettes count, and the backend doesn't give us data back, then we
	 * just multiply the daily count by 7 or 30, and put exact=false.
	 */
	exact: boolean;
	/**
	 * The frequency on this cigarettes number
	 */
	frequency: Frequency;
}

export function Home(props: HomeProps): React.ReactElement {
	const { navigation } = props;

	const { api } = useContext(ApiContext);
	const { currentLocation } = useContext(CurrentLocationContext);
	const { frequency } = useContext(FrequencyContext);

	if (!api) {
		throw new Error(
			'Home/Home.tsx only gets displayed when `api` is defined.'
		);
	} else if (!currentLocation) {
		throw new Error(
			'Home/Home.tsx only gets displayed when `currentLocation` is defined.'
		);
	}

	trackScreen('HOME');

	// Decide on how many cigarettes we want to show on the Home screen.
	const [cigarettes, setCigarettes] = useState<Cigarettes>({
		count: api.shootismoke.dailyCigarettes,
		exact: true,
		frequency,
	});
	useEffect(() => {
		setCigarettes({
			count:
				api.shootismoke.dailyCigarettes *
				(frequency === 'daily' ? 1 : frequency === 'weekly' ? 7 : 30),
			// Since for weeky and monthyl, we just multiply, it's not exact
			exact: frequency === 'daily',
			frequency,
		});
	}, [api, frequency]);

	return (
		<View style={styles.container}>
			<SmokeVideo cigarettes={cigarettes.count} />
			<Header
				onChangeLocationClick={(): void => {
					track('HOME_SCREEN_CHANGE_LOCATION_CLICK');
					navigation.navigate('Search');
				}}
			/>
			<ScrollView bounces={false} style={styles.scroll}>
				<CigarettesBlock
					cigarettes={cigarettes.count}
					cigarettesStyle={styles.cigarettes}
					fullCigaretteLength={scale(
						cigarettes.count <= THRESHOLD.FIRST
							? SIZES.BIG
							: cigarettes.count <= THRESHOLD.SECOND
							? SIZES.MEDIUM
							: cigarettes.count <= THRESHOLD.THIRD
							? SIZES.BIG
							: cigarettes.count <= THRESHOLD.FOURTH
							? SIZES.MEDIUM
							: SIZES.SMALL
					)}
					showMaxCigarettes={64}
					spacingHorizontal={getCigarettesMargin(cigarettes.count)}
					spacingVertical={getCigarettesMargin(cigarettes.count)}
					style={[theme.withPadding, styles.withMargin]}
					t={t}
					textStyle={[theme.shitText, styles.withMargin]}
				/>
				<SelectFrequency style={styles.withMargin} />
				<AdditionalInfo
					exactCount={cigarettes.exact}
					frequency={frequency}
					navigation={navigation}
					style={styles.withMargin}
				/>
				<Footer
					navigation={navigation}
					style={[styles.withMargin, styles.footer]}
				/>
			</ScrollView>
		</View>
	);
}
