// Sh**t! I Smoke
// Copyright (C) 2018-2019  Marcelo S. Coelho, Amaury Martiny

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

import React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { scale } from 'react-native-size-matters';

import wait from '../../../../assets/images/wait.png';
import { CIGARETTES_HEIGHT } from '../../../components/Cigarettes';

interface WaitProps {
  style?: StyleProp<ViewStyle>;
}

export function Wait ({ style }: WaitProps) {
  return (
    <View style={[styles.container, style]}>
      <Image resizeMode="contain" source={wait} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: scale(CIGARETTES_HEIGHT)
  }
});
