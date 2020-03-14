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
 * The current release channel. Can be one of `development`, `default` or
 * `production-v{version}`.
 */
export const RELEASE_CHANNEL: string =
  Constants.manifest.releaseChannel || 'development';

/**
 * Whether we're running a staging version of the app
 */
export const IS_STAGING = RELEASE_CHANNEL === 'default';

/**
 * Whether we're running a production version of the app
 */
export const IS_PROD =
  RELEASE_CHANNEL === `production-v${Constants.manifest.version}`;

/**
 * Whether or not we should set up Sentry bug tracking
 */
export const IS_SENTRY_SET_UP =
  // We also added sentry on staging btw
  (IS_PROD || IS_STAGING) &&
  typeof Constants.manifest.extra.sentryPublicDsn === 'string';
