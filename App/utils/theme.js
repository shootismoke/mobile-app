import { Constants } from 'expo';
import { Platform } from 'react-native';

export const backgroundColor = '#FAFAFC';

export const primaryColor = '#F2A972';

export const textColor = '#414248';

export const secondaryTextColor = '#7B7D88';

export const fullScreen = {
  backgroundColor,
  flex: 1,
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

export const text = {
  color: secondaryTextColor,
  fontFamily: 'gotham-book',
  fontSize: 12,
  letterSpacing: 0.22,
  lineHeight: 20,
  textAlign: 'justify'
};

export const title = {
  color: textColor,
  fontFamily: 'gotham-black'
};

export const withPadding = {
  paddingHorizontal: 17
};
