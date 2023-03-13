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

import {
	ActionSheetOptions,
	useActionSheet,
} from '@expo/react-native-action-sheet';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { AmplitudeEvent, track } from '../../util/amplitude';

interface ActionPickerProps {
	actionSheetOptions: ActionSheetOptions;
	/**
	 * Which Amplitude event to track when opening the action picker.
	 */
	amplitudeOpenEvent?: AmplitudeEvent;
	callback: (i: number | undefined) => void;
	children: (open: () => void) => React.ReactElement;
}

export function ActionPicker(props: ActionPickerProps): React.ReactElement {
	const {
		actionSheetOptions,
		amplitudeOpenEvent,
		callback,
		children,
		...rest
	} = props;
	const { showActionSheetWithOptions } = useActionSheet();

	function handleActionSheet(): void {
		amplitudeOpenEvent && track(amplitudeOpenEvent);
		showActionSheetWithOptions(actionSheetOptions, callback);
	}

	return (
		<TouchableOpacity onPress={handleActionSheet} {...rest}>
			{children(handleActionSheet)}
		</TouchableOpacity>
	);
}
