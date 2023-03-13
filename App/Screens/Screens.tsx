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

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Api } from '@shootismoke/ui';

import { ApiContext, ErrorContext } from '../stores';
import * as theme from '../util/theme';
import { About } from './About';
import { Details } from './Details';
import { ErrorScreen } from './ErrorScreen';
import { Home } from './Home';
import { Loading } from './Loading';
import { RootStackParams } from './routeParams';
import { Search } from './Search';

/**
 * The main stack navigator, for the app.
 */
const RootStack = createStackNavigator<RootStackParams>();

/**
 * A stack navigator for the error case.
 */
const ErrorStack = createStackNavigator();

/**
 * Shared navigator screen options across different screens.
 */
const screenOpt = {
	options: { headerShown: false },
};

function renderScreen(api?: Api, error?: Error): React.ReactElement {
	if (error) {
		return (
			<ErrorStack.Navigator initialRouteName="Error">
				<ErrorStack.Screen
					component={ErrorScreen}
					name="Error"
					{...screenOpt}
				/>
				<ErrorStack.Screen
					component={Search}
					name="Search"
					{...screenOpt}
				/>
			</ErrorStack.Navigator>
		);
	}

	if (!api) {
		return <Loading />;
	}

	return (
		<RootStack.Navigator initialRouteName="Home">
			<RootStack.Screen component={About} name="About" {...screenOpt} />
			<RootStack.Screen
				component={Details}
				name="Details"
				{...screenOpt}
			/>
			<RootStack.Screen component={Home} name="Home" {...screenOpt} />
			<RootStack.Screen component={Search} name="Search" {...screenOpt} />
		</RootStack.Navigator>
	);
}

export function Screens(): React.ReactElement {
	const { api } = useContext(ApiContext);
	const { error } = useContext(ErrorContext);

	return (
		<View style={theme.fullScreen}>
			<StatusBar style="auto" animated={true} translucent={true} />
			<NavigationContainer>
				{renderScreen(api, error)}
			</NavigationContainer>
		</View>
	);
}
