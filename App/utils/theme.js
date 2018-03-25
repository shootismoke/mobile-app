import { Constants } from 'expo';

export const primaryColor = '#F2A972';

export const textColor = '#414248';

export const secondaryTextColor = '#7B7D88';

export const fullScreen = {
  backgroundColor: 'white',
  flex: 1,
  paddingTop: Constants.statusBarHeight
};

export const link = {
  color: primaryColor,
  fontFamily: 'gotham-book',
  textDecorationLine: 'underline'
};

export const text = {
  color: secondaryTextColor,
  fontFamily: 'gotham-book',
  fontSize: 12,
  letterSpacing: 0.22,
  lineHeight: 16,
  textAlign: 'justify'
};

export const title = {
  color: textColor,
  fontFamily: 'gotham-black'
};

export const withPadding = {
  paddingHorizontal: 17
};
