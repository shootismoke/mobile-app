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

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as Sentry from 'sentry-expo';
import { FrequencyContextProvider } from '@shootismoke/ui';

import { Screens } from './Screens';
import { Background as LoadingBackground } from './Screens/Loading/Background';
import {
	ApiContextProvider,
	DistanceUnitProvider,
	ErrorContextProvider,
	LocationContextProvider,
} from './stores';
import { setupAmplitude, track } from './util/amplitude';
import { IS_SENTRY_SET_UP } from './util/constants';
import { sentryError } from './util/sentry';

// Add Sentry if available
if (IS_SENTRY_SET_UP) {
	Sentry.Native.init({
		dsn: Constants.expoConfig?.extra?.sentryPublicDsn as string,
		debug: true,
	});
}

export function App(): React.ReactElement {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		Promise.all([
			Font.loadAsync({
				Montserrat400:
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					require('../assets/fonts/Montserrat_Regular_400.ttf') as Font.FontResource,
				Montserrat500:
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					require('../assets/fonts/Montserrat_Medium_500.ttf') as Font.FontResource,
				Montserrat800:
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					require('../assets/fonts/Montserrat_ExtraBold_800.ttf') as Font.FontResource,
			}),
			// Add Amplitude if available
			setupAmplitude(),
		])
			.then(() => setReady(true))
			.catch(sentryError('App'));
	}, []);

	useEffect(() => {
		// Track user closing/re-opening the app
		AppState.addEventListener('change', (state) => {
			if (state === 'active') {
				track('APP_REFOCUS');
			} else if (state === 'background') {
				track('APP_EXIT');
			}
		});
	}, []);

	return (
		<ErrorContextProvider>
			<LocationContextProvider>
				<ActionSheetProvider>
					<ApiContextProvider>
						<FrequencyContextProvider>
							<DistanceUnitProvider>
								{ready ? <Screens /> : <LoadingBackground />}
							</DistanceUnitProvider>
						</FrequencyContextProvider>
					</ApiContextProvider>
				</ActionSheetProvider>
			</LocationContextProvider>
		</ErrorContextProvider>
	);
}
