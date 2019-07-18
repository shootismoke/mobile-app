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
import { Image, StyleSheet, View } from 'react-native';

import butt from '../../../../assets/images/butt.png';
import buttVertical from '../../../../assets/images/butt-vertical.png';
import head from '../../../../assets/images/head.png';
import headVertical from '../../../../assets/images/head-vertical.png';

export type CigaretteSize = 'small' | 'medium' | 'big';

interface CigaretteProps {
  diagonal: boolean;
  length: number;
  size: CigaretteSize;
  vertical: boolean;
}
export function Cigarette (props: CigaretteProps) {
  const { diagonal, length, vertical } = props;

  // Max and min lengths of a cigarette
  const maxWidth = getMaxWidth(props);
  const minWidth = 0.4 * maxWidth;

  return (
    <View
      style={[
        diagonal
          ? {
            justifyContent: 'center',
            height:
                (minWidth + length * (maxWidth - minWidth)) / Math.sqrt(2),
            width: (minWidth + length * (maxWidth - minWidth)) / Math.sqrt(2)
          }
          : null
      ]}
    >
      <View
        removeClippedSubviews
        style={[
          styles.container,
          diagonal
            ? {
              width: minWidth + length * (maxWidth - minWidth)
            }
            : vertical
              ? {
                height: minWidth + length * (maxWidth - minWidth)
              }
              : {
                width: minWidth + length * (maxWidth - minWidth)
              },
          diagonal ? styles.diagonal : null
        ]}
      >
        <Image
          source={vertical ? buttVertical : butt}
          style={getButtStyle(props)}
        />
        <Image
          source={vertical ? headVertical : head}
          style={[styles.head, getHeadStyle(props)]}
        />
      </View>
    </View>
  );
}

function getButtStyle (props: CigaretteProps) {
  const ratio = 280 / 21; // Ratio of our image
  const { size } = props;

  switch (size) {
    case 'big':
      return {
        overflow: 'hidden' as 'hidden',
        height: getMaxWidth(props) / ratio,
        width: getMaxWidth(props)
      };
    case 'medium':
      return {
        overflow: 'hidden' as 'hidden',
        height: getMaxWidth(props),
        marginHorizontal: 4,
        width: getMaxWidth(props) / ratio
      };
    default:
      return {
        overflow: 'hidden' as 'hidden',
        height: getMaxWidth(props),
        marginHorizontal: 2,
        width: getMaxWidth(props) / ratio
      };
  }
}

function getHeadStyle (props: CigaretteProps) {
  const ratio = 27 / 20; // Ratio of our image
  const { size } = props;

  switch (size) {
    case 'big':
      return {};
    case 'medium':
      return {
        height: 12 * ratio,
        marginHorizontal: 4,
        width: 12
      };
    default:
      return {
        height: 6 * ratio,
        marginHorizontal: 2,
        width: 6
      };
  }
}

function getMaxWidth (props: CigaretteProps) {
  const { diagonal, size } = props;

  if (diagonal) return 200;
  switch (size) {
    case 'big':
      return 280;
    case 'medium':
      return 160;
    default:
      return 81;
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    marginTop: 8,
    overflow: 'hidden'
  },
  diagonal: {
    transform: [{ rotate: '45deg' }, { scale: 1 }]
  },
  head: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0
  }
});
