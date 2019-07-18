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

import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { scale } from 'react-native-size-matters';

export type ShadowPosition = 'top' | 'bottom';

export const backgroundColor = '#FAFAFC';
export const gothamBlack = 'gotham-black';
export const iconBackgroundColor = '#EBE7DD';
export const gotham = 'gotham-book';
export const primaryColor = '#F8A65D';
export const textColor = '#44464A';
export const secondaryTextColor = '#8B909A';
export const spacing = {
  tiny: scale(10),
  small: scale(15),
  normal: scale(20),
  big: scale(36)
};

/**
 * The Gotham font seems like not 100% aligned vertically in the middle,even
 * when everything's configured in the middle, just remove this and see for
 * youself.
 * FIXME
 */
const fixTextMargin = {
  ...Platform.select({
    ios: {
      marginTop: scale(3)
    }
  })
};

export const elevatedLevel1 = (position: ShadowPosition) => ({
  elevation: 2,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: position === 'top' ? -2 : 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2
});

export const elevatedLevel2 = (position: ShadowPosition) => ({
  elevation: 10,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: position === 'top' ? -9 : 9 },
  shadowOpacity: 0.4,
  shadowRadius: 9,
  zIndex: 100
});

export const fullScreen = {
  backgroundColor,
  flexGrow: 1,
  paddingTop: Constants.statusBarHeight
};

export const link = {
  color: primaryColor,
  fontFamily: gotham,
  textDecorationLine: 'underline' as 'underline'
};

/**
 * Big text with "Sh*t! I smoked...""
 */
export const shitText = {
  color: textColor,
  fontFamily: gothamBlack,
  fontSize: scale(32),
  letterSpacing: scale(-1),
  lineHeight: scale(36),
  ...fixTextMargin
};

/**
 * Normal text
 */
export const text = {
  color: secondaryTextColor,
  fontFamily: gotham,
  fontSize: scale(11),
  letterSpacing: scale(0.85),
  lineHeight: scale(15),
  textAlign: 'justify' as 'justify'
};

export const title = {
  letterSpacing: scale(3.14),
  lineHeight: scale(18),
  color: textColor,
  fontFamily: gothamBlack,
  fontSize: scale(12),
  ...fixTextMargin
};

export const withPadding = {
  paddingHorizontal: spacing.normal
};
