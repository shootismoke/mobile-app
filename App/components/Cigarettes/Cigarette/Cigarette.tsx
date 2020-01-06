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
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { scale } from 'react-native-size-matters';

import buttVertical from '../../../../assets/images/butt-vertical.png';
import butt from '../../../../assets/images/butt.png';
import headVertical from '../../../../assets/images/head-vertical.png';
import head from '../../../../assets/images/head.png';

export type CigaretteOrientation = 'diagonal' | 'horizontal' | 'vertical';
export type CigaretteSize = 'small' | 'medium' | 'big';

// The height of 1 vertical cigarrette
export const CIGARETTES_HEIGHT = 90;

interface CigaretteProps {
  percentage: number;
  orientation: CigaretteOrientation;
  size: CigaretteSize;
  style?: StyleProp<ViewStyle>;
}

const MIN_PERCENTAGE = 0.4; // The percentage of cigarette length when `percentage=0`

const styles = StyleSheet.create({
  butt: {
    bottom: 0,
    position: 'absolute',
    left: 0,
    resizeMode: 'contain'
  },
  cigarette: {
    flexGrow: 1
  },
  container: {
    overflow: 'hidden'
  },
  diagonal: {
    height: Math.floor(scale(CIGARETTES_HEIGHT) / Math.SQRT2),
    position: 'absolute',
    transform: [{ rotate: '45deg' }, { scale: 1 }],
    width: Math.floor(scale(CIGARETTES_HEIGHT) / Math.SQRT2)
  },
  head: {
    flexGrow: 1,
    position: 'absolute',
    resizeMode: 'contain',
    right: 0,
    top: 0,
    zIndex: 1
  }
});

function getCigaretteActualLength(length: number, percentage: number): number {
  return Math.ceil(
    scale(((1 - MIN_PERCENTAGE) * percentage + MIN_PERCENTAGE) * length)
  );
}

/**
 * Get height/width & margin of cigarette depending on `size` param, we assume
 * here that height<width, i.e. the cigarette is horizontal
 *
 * Measures come from Figma
 */
function getMeasures(size: CigaretteSize, percentage: number): ViewStyle {
  switch (size) {
    case 'big': {
      return {
        height: Math.ceil(scale(13)),
        margin: Math.ceil(scale(12)),
        width: getCigaretteActualLength(185, percentage)
      };
    }
    case 'medium': {
      return {
        height: Math.ceil(scale(7)),
        margin: Math.ceil(scale(6)),
        width: getCigaretteActualLength(CIGARETTES_HEIGHT, percentage)
      };
    }
    case 'small': {
      return {
        height: Math.ceil(scale(4)),
        margin: Math.ceil(scale(3)),
        width: getCigaretteActualLength(41, percentage)
      };
    }
  }
}

function getStyle(
  orientation: CigaretteOrientation,
  percentage: number,
  size: CigaretteSize
): ViewStyle {
  const { height, width, margin } = getMeasures(size, percentage);

  switch (orientation) {
    case 'horizontal': {
      return {
        height: height,
        marginTop: margin,
        marginRight: 100,
        width: width
      };
    }
    case 'vertical': {
      return {
        height: width,
        marginRight: margin,
        marginTop: Math.ceil(scale(4)),
        width: height
      };
    }
    default:
      return {};
  }
}

function renderCigarette(
  orientation: CigaretteOrientation,
  percentage: number,
  size: CigaretteSize,
  additionalStyle?: StyleProp<ViewStyle>
): React.ReactElement {
  return (
    <View
      style={[
        styles.container,
        getStyle(orientation, percentage, size),
        additionalStyle
      ]}
    >
      <Image
        source={orientation === 'vertical' ? buttVertical : butt}
        style={[
          styles.butt,
          // butt@3x is 840x63px
          orientation === 'vertical'
            ? { aspectRatio: 63 / 840, height: undefined, width: '100%' }
            : { aspectRatio: 830 / 63, height: '100%', width: undefined }
        ]}
      />
      <Image
        source={orientation === 'vertical' ? headVertical : head}
        style={[
          styles.head,
          // head@3x is 81x60px
          orientation === 'vertical'
            ? { aspectRatio: 60 / 81, height: undefined, width: '100%' }
            : { aspectRatio: 81 / 60, height: '100%', width: undefined }
        ]}
      />
    </View>
  );
}

export function Cigarette(props: CigaretteProps): React.ReactElement {
  const { orientation, percentage, size, style } = props;

  return orientation === 'diagonal' ? (
    <View
      style={[
        styles.diagonal,
        percentage >= 0.3
          ? { paddingTop: -(30 / 0.7) * percentage + 30 / 0.7 } // very empirical
          : undefined,
        style
      ]}
    >
      {renderCigarette(
        'horizontal',
        percentage,
        percentage >= 0.3 ? 'medium' : 'big'
      )}
    </View>
  ) : (
    renderCigarette(orientation, percentage, size, style)
  );
}
