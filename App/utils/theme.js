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

import { Constants } from 'expo';
import { Platform } from 'react-native';

export const backgroundColor = '#FAFAFC';
export const boldFont = 'gotham-black';
export const iconBackgroundColor = '#EBE7DD';
export const normalFont = 'gotham-book';
export const primaryColor = '#F8A65D';
export const textColor = '#414248';
export const secondaryTextColor = '#7B7D88';
export const spacing = {
  tiny: 6,
  small: 12,
  normal: 18,
  big: 36
};

export const elevatedLevel1 = position => ({
  elevation: 2,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: position === 'top' ? -2 : 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2
});

export const elevatedLevel2 = position => ({
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
  fontFamily: normalFont,
  textDecorationLine: 'underline'
};

/**
 * Big text with "Sh*t! I smoked...""
 */
export const shitText = {
  color: textColor,
  fontFamily: boldFont,
  fontSize: 48
};

/**
 * Normal text
 */
export const text = {
  color: secondaryTextColor,
  fontFamily: normalFont,
  fontSize: 12,
  letterSpacing: 0.85,
  lineHeight: 16,
  textAlign: 'justify'
};

export const title = {
  letterSpacing: 2,
  lineHeight: 21,
  color: textColor,
  fontFamily: boldFont,
  fontSize: 15
};

export const withPadding = {
  paddingHorizontal: spacing.normal
};

export const bigButton = {
  backgroundColor: primaryColor,
  borderRadius: 24,
  height: 48,
  paddingHorizontal: 24,
  paddingVertical: 12
};

export const bigButtonText = {
  ...title,
  color: 'white',
  ...Platform.select({
    android: {
      fontSize: 14
    },
    ios: {
      fontSize: 14
    }
  }),
  lineHeight: 24,
  textAlign: 'center'
};
