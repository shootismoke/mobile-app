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

import Hawk from '@hapi/hawk/lib/browser';
import Constants from 'expo-constants';
import { GraphQLError } from 'graphql';

import { RELEASE_CHANNEL } from '../../util/constants';
import { sentryError } from '../../util/sentry';

export interface Credentials {
	id: string;
	key: string;
	algorithm: 'sha256';
}

// Hawk credentials
export const credentials: Credentials = {
	id: `${Constants.manifest.slug as string}-${RELEASE_CHANNEL}`,
	key: Constants.manifest.extra.hawkKey as string,
	algorithm: 'sha256',
};

/**
 * Custom fetch for Hawk. Like `fetch`, but adds Hawk authentication on each
 * network call.
 *
 * @see https://www.apollographql.com/docs/react/v3.0-beta/networking/advanced-http-networking/#custom-fetching
 */
export function hawkFetch(backendUri: string) {
	return function (
		input: RequestInfo,
		init: RequestInit = {}
	): Promise<Response> {
		// Set Hawk authorization header on each request
		const header = Hawk.client.header(backendUri, 'POST', {
			credentials,
		}).header as string;

		return fetch(input, {
			...init,
			headers: { authorization: header, ...init.headers },
		});
	};
}

/**
 * Number of times we got "Stale timestamp" error
 */
let staleTimestampCount = 0;

export const HAWK_STALE_TIMESTAMP = 'Hawk: Stale timestamp';

/**
 * Correctly handle `Stale timestamp` error from Hawk. We need to adjust local
 * timestamp offset.
 * @see https://github.com/hapijs/hawk/issues/86#issuecomment-20861575
 *
 * @param error - Error with message {{HAWK_STALE_TIMESTAMP}}.
 */
export function handleStaleTimestamp(
	error: GraphQLError,
	credentials: Credentials
): void {
	try {
		// We only retry to calibrate our local timestamp offset max 5 times.
		++staleTimestampCount;
		if (staleTimestampCount >= 5) {
			throw new Error(
				`Received "Stale timestamp" error ${staleTimestampCount} times`
			);
		}

		if (
			!error.extensions ||
			!error.extensions.ts ||
			!error.extensions.tsm
		) {
			throw new Error(
				`Stale timestamp response does not contain \`ts\` and \`tsm\` fields: ${JSON.stringify(
					error.extensions
				)}`
			);
		}

		// Use authenticateTimestamp to adjust local timestamp offset
		// https://github.com/hapijs/hawk/issues/86#issuecomment-20861575
		const updated: boolean = Hawk.authenticateTimestamp(
			error.extensions,
			credentials
		) as boolean;

		if (!updated) {
			throw new Error('authenticateTimestamp returned false');
		}
	} catch (error) {
		sentryError('Apollo')(error);
	}
}
