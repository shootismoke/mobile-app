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

import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { scale } from 'react-native-size-matters';

import { Cigarette, CIGARETTES_HEIGHT, CigaretteSize } from './Cigarette';

interface CigarettesProps {
  cigarettes: number;
  style?: StyleProp<ViewStyle>;
}

export { CIGARETTES_HEIGHT };

function getSize(cigarettes: number): CigaretteSize {
  if (cigarettes <= 1) return 'big';
  if (cigarettes <= 4) return 'big';
  if (cigarettes <= 14) return 'medium';
  return 'small';
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: scale(CIGARETTES_HEIGHT),
    // width: '60%'
    width: scale(250)
  },
  innerContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});

export function Cigarettes(props: CigarettesProps): React.ReactElement {
  const { cigarettes: realCigarettes } = props;
  const cigarettes =
    Math.round(Math.max(0.1, Math.min(realCigarettes, 50)) * 10) / 10; // We don't show more than 50
  // const cigarettes = 1.9; // Can change values here for testing

  const count = Math.floor(cigarettes); // The cigarette count, without decimal
  const decimal = cigarettes - count;

  const orientation =
    cigarettes <= 1 ? 'diagonal' : cigarettes <= 4 ? 'horizontal' : 'vertical';

  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.innerContainer}>
        {cigarettes > 1 &&
          count >= 1 &&
          Array.from(Array(count)).map((_, i) => (
            <Cigarette
              key={i}
              orientation={orientation}
              percentage={1}
              size={getSize(cigarettes)}
            />
          ))}
        {(cigarettes === 1 || decimal > 0) && (
          <Cigarette
            orientation={orientation}
            percentage={decimal || 1}
            size={getSize(cigarettes)}
          />
        )}
      </View>
    </View>
  );
}
