import { DistanceUnit } from "@shootismoke/ui";
import { TFunction } from "i18next";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Picker, StyleSheet, Platform } from "react-native";
import { scale } from "react-native-size-matters";

import { AmplitudeEvent, track } from "../../../util/amplitude";
import * as theme from '../../../util/theme';
import { useDistanceUnit } from "../../../stores";

interface DistanceUnitOptionProps {
	t: TFunction
}

const styles = StyleSheet.create({
	distance: {
		borderTopColor: theme.iconBackgroundColor,
		borderTopWidth: 1,
		marginBottom: theme.spacing.big,
		paddingTop: theme.spacing.big,
	},
	h2: {
		...theme.title,
		fontSize: scale(20),
		letterSpacing: 0,
		lineHeight: scale(24),
		marginBottom: theme.spacing.small,
	},
	distancePicker: {
		...Platform.select({
			ios: {
				marginBottom: scale(-60),
				marginTop: scale(-40),
			},
		}),
	},
})

function DistanceUnitOption(props: DistanceUnitOptionProps): React.ReactElement {
	const { t } = props
	const { distanceUnit, setDistanceUnit } = useDistanceUnit();

	return (
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
				label={t('settings.distance_unit.km', 'km')}
				value="km"
			/>
			<Picker.Item
				label={t('settings.distance_unit.mile', 'mile')}
				value="mile"
			/>
		</Picker>
	)
}

export function Setting(): React.ReactElement {
	const { t } = useTranslation('screen_about')

	return (
		<View style={styles.distance}>
			<Text style={styles.h2}>{t('settings.title')}</Text>
			<Text style={theme.text}>
				{t('settings.distance_unit.label')}
			</Text>
			<DistanceUnitOption t={t} />
			{/* TODO Add changing languages https://github.com/amaurymartiny/shoot-i-smoke/issues/73 */}
		</View>
	)
}
