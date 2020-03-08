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

import {
  ActionSheetOptions,
  useActionSheet
} from '@expo/react-native-action-sheet';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ActionPickerProps extends TouchableOpacityProps {
  actionSheetOptions: ActionSheetOptions;
  callback: (i: number) => void;
  children: (open: () => void) => React.ReactElement;
}

export function ActionPicker(props: ActionPickerProps): React.ReactElement {
  const { actionSheetOptions, callback, children, ...rest } = props;
  const { showActionSheetWithOptions } = useActionSheet();

  function handleActionSheet(): void {
    showActionSheetWithOptions(actionSheetOptions, callback);
  }

  return (
    <TouchableOpacity onPress={handleActionSheet} {...rest}>
      {children(handleActionSheet)}
    </TouchableOpacity>
  );
}
