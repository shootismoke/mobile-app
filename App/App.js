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

import React, { PureComponent } from 'react';
import { Constants, Font } from 'expo';
import { Provider } from 'mobx-react';
import Sentry from 'sentry-expo';

import { RootStore } from './stores';
import { Background as LoadingBackground } from './Screens/Loading/Background';
import { Screens } from './Screens';

// Set up global MST stores
const stores = RootStore.create({
  api: undefined,
  error: undefined,
  location: {}
});

// Add sentry if available
if (Constants.manifest.extra.sentryPublicDsn) {
  Sentry.config(Constants.manifest.extra.sentryPublicDsn).install();
}

export class App extends PureComponent {
  state = {
    fontLoaded: false
  };

  async componentDidMount () {
    // Using custom fonts with Expo
    // https://docs.expo.io/versions/latest/guides/using-custom-fonts
    await Font.loadAsync({
      'gotham-black': require('../assets/fonts/Gotham-Black.ttf'),
      'gotham-book': require('../assets/fonts/Gotham-Book.ttf')
    });

    this.setState({ fontLoaded: true });
  }

  render () {
    const { fontLoaded } = this.state;

    return fontLoaded ? (
      <Provider stores={stores}>
        <Screens />
      </Provider>
    ) : (
      <LoadingBackground />
    );
  }
}
