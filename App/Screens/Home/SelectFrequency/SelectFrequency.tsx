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

import React, { useContext, useRef, useState } from 'react';
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native';
import { Frequency, FrequencyContext } from '@shootismoke/ui';

import { BoxButton } from '../../../components';
import { t } from '../../../localization';
import { track } from '../../../util/amplitude';
import * as theme from '../../../util/theme';

const styles = StyleSheet.create({
	boxButton: {
		marginRight: theme.spacing.mini,
	},
	container: {
		flexDirection: 'row',
	},
	content: {
		paddingHorizontal: theme.spacing.normal,
	},
});

export function SelectFrequency(props: ScrollViewProps): React.ReactElement {
	const scroll = useRef<ScrollView>(null);
	const { frequency, setFrequency } = useContext(FrequencyContext);
	const [dailyWidth, setDailyWidth] = useState(0); // Width of the daily button

	const { style, ...rest } = props;

	function handleChangeFrequency(f: Frequency): void {
		setTimeout(() => {
			setFrequency(f);
		}, 400);
	}

	return (
		<ScrollView
			contentContainerStyle={styles.content}
			horizontal
			ref={scroll}
			showsHorizontalScrollIndicator={false}
			style={[styles.container, style]}
			{...rest}
		>
			<BoxButton
				active={frequency === 'daily'}
				onLayout={(event): void =>
					setDailyWidth(event.nativeEvent.layout.width)
				}
				onPress={(): void => {
					track('HOME_SCREEN_DAILY_CLICK');
					if (frequency === 'daily') {
						return;
					}

					if (scroll && scroll.current) {
						scroll.current.scrollTo({ x: 0 });
					}
					handleChangeFrequency('daily');
				}}
				style={styles.boxButton}
			>
				{t('home_frequency_daily')}
			</BoxButton>
			<BoxButton
				active={frequency === 'weekly'}
				onPress={(): void => {
					track('HOME_SCREEN_WEEKLY_CLICK');
					if (frequency === 'weekly') {
						return;
					}

					if (scroll && scroll.current) {
						scroll.current.scrollTo({
							x: dailyWidth + theme.spacing.mini,
						});
					}
					handleChangeFrequency('weekly');
				}}
				style={styles.boxButton}
			>
				{t('home_frequency_weekly')}
			</BoxButton>

			<BoxButton
				active={frequency === 'monthly'}
				onPress={(): void => {
					track('HOME_SCREEN_MONTHLY_CLICK');
					if (frequency === 'monthly') {
						return;
					}

					if (scroll && scroll.current) {
						scroll.current.scrollToEnd();
					}
					handleChangeFrequency('monthly');
				}}
				style={styles.boxButton}
			>
				{t('home_frequency_monthly')}
			</BoxButton>
		</ScrollView>
	);
}
