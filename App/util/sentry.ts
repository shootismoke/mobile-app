// Shoot! I Smoke
// Copyright (C) 2018-2023  Marcelo S. Coelho, Amaury M.

// Shoot! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Shoot! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Shoot! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import * as Sentry from 'sentry-expo';

import { IS_SENTRY_SET_UP } from './constants';

// We don't send the following errors to Sentry to not pollute it.
const UNTRACKED_ERRORS = [
	// Location not allowed
	'Permission to access location was denied',
	'Location provider is unavailable. Make sure that location services are enabled',
	'Location request timed out',
	'Location request failed due to unsatisfied device settings',
	'Reverse geocoding returned no results',
	// Notifications not allowed
	'Permission to access notifications was denied',
	// No results from data providers
	'does not have PM2.5 measurings right now',
	'Cannot normalize, got 0 result',
	'Request to fetch API data timed out',
	// First time fetching a user
	'No user with',
];

/**
 * Send an error to Sentry.
 *
 * @see https://sentry.io
 * @param error - The error to send
 */
export function sentryError(namespace: string) {
	return function (error: Error): void {
		if (
			IS_SENTRY_SET_UP &&
			!UNTRACKED_ERRORS.some((msg) => error.message.includes(msg))
		) {
			Sentry.Native.captureException(error);
		}

		console.log(`[${namespace}]: ${error.message}`);
	};
}
