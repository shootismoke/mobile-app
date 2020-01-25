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

import Constants from 'expo-constants';

/**
 * Whether we're running a production version of the app
 */
export const IS_PROD =
  Constants.manifest.releaseChannel ===
  `production-v${Constants.manifest.version}`;

/**
 * Whether Sentry bug tracking is set up
 */
export const IS_SENTRY_SET_UP = !!Constants.manifest.extra.sentryPublicDsn;
