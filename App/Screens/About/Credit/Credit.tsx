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

import Constants from 'expo-constants';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Text, View, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

import * as theme from '../../../util/theme';
import {
	handleOpenAmaury,
	handleOpenMarcelo,
	handleOpenOpenAQ,
	handleOpenWaqi,
	handleOpenGithub,
} from '../bookmarks';
import { Exlink } from '../../../components/ExternalLink';

const styles = StyleSheet.create({
	credits: {
		borderTopColor: theme.iconBackgroundColor,
		borderTopWidth: 1,
		marginBottom: theme.spacing.normal,
		paddingTop: theme.spacing.big,
	},
	h2: {
		...theme.title,
		fontSize: scale(20),
		letterSpacing: 0,
		lineHeight: scale(24),
		marginBottom: theme.spacing.small,
	},
});

export function Credit(): React.ReactElement {
	const { t } = useTranslation('screen_about');

	const appName = Constants.manifest.name;
	const appVer = Constants.manifest.revisionId || Constants.manifest.version;

	return (
		<View style={styles.credits}>
			<Text style={styles.h2}>{t('credits.title')}</Text>
			<Text style={theme.text}>
				<Trans
					i18nKey="credits.concept_and_development"
					values={{ author: 'Amaury Martiny' }}
					t={t}
				>
					Concept {'&'} Development by{' '}
					<Exlink dest={handleOpenAmaury}>{'{{author}}'}</Exlink>.
				</Trans>
				{'\n'}
				<Trans
					i18nKey="credits.design_and_copywriting"
					values={{ author: 'Marcelo S. Coelho' }}
					t={t}
				>
					Design {'&'} Copywriting by{' '}
					<Exlink dest={handleOpenMarcelo}>{'{{author}}'}</Exlink>.
				</Trans>
				{'\n'}
				{'\n'}
				<Trans i18nKey="credits.database" t={t}>
					Air quality data from{' '}
					<Exlink dest={handleOpenWaqi}>WAQI</Exlink> and{' '}
					<Exlink dest={handleOpenOpenAQ}>OpenAQ</Exlink>.
				</Trans>
				{'\n'}
				<Trans i18nKey="credits.source_code" t={t}>
					Source code{' '}
					<Exlink dest={handleOpenGithub}>available on Github</Exlink>
					.
				</Trans>
				{'\n'}
				{'\n'}
				{`${appName || ''} v${appVer || '?'}`}.
			</Text>
		</View>
	);
}
