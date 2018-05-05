// Copyright (c) 2018, Amaury Martiny and the Shoot! I Smoke contributors
// SPDX-License-Identifier: GPL-3.0

import { Constants } from 'expo';
import { Platform } from 'react-native';

export const backgroundColor = '#FAFAFC';
export const iconBackgroundColor = '#EBE7DD';
export const primaryColor = '#F8A65D';
export const textColor = '#414248';
export const secondaryTextColor = '#7B7D88';

export const elevatedLevel1 = {
  elevation: 2,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2
};

export const elevatedLevel2 = {
  elevation: 10,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 9 },
  shadowOpacity: 0.4,
  shadowRadius: 9,
  zIndex: 100
};

export const fullScreen = {
  backgroundColor,
  flexGrow: 1,
  paddingTop: Constants.statusBarHeight
};

export const link = {
  color: primaryColor,
  fontFamily: 'gotham-book',
  textDecorationLine: 'underline'
};

export const modal = Platform.select({
  android: {
    marginTop: -Constants.statusBarHeight // On Android the modal only goes up until the status bar
  }
});

export const paragraph = Platform.select({
  android: {
    lineHeight: 28
  },
  ios: {
    lineHeight: 20
  }
});

/**
 * Big text with "Sh*t! I smoked...""
 */
export const shitText = {
  color: textColor,
  fontFamily: 'gotham-black',
  fontSize: 48
};

/**
 * Normal text
 */
export const text = {
  color: secondaryTextColor,
  fontFamily: 'gotham-book',
  fontSize: 12,
  letterSpacing: 0.22,
  textAlign: 'justify'
};

export const title = {
  letterSpacing: 2,
  color: textColor,
  fontFamily: 'gotham-black'
};

export const withPadding = {
  paddingHorizontal: 19
};

export const bigButton = {
  backgroundColor: primaryColor,
  borderRadius: 22,
  paddingHorizontal: 22,
  paddingVertical: 11
};

export const bigButtonText = {
  ...title,
  color: 'white',
  ...Platform.select({
    android: {
      fontSize: 15
    },
    ios: {
      fontSize: 14
    }
  }),
  textAlign: 'center'
};
