// Sh**t! I Smoke
// Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.

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

import { Lazy } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

import { sentryError } from './sentry';

/**
 * Convert a Promise<A> into a TaskEither<Error, A>
 * @param fn - Function returning a Promise
 */
export function promiseToTE<A>(
	fn: Lazy<Promise<A>>,
	namespace: string
): TE.TaskEither<Error, A> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return TE.tryCatch(fn, (reason: any) => {
		const error =
			reason instanceof Error ? reason : new Error(String(reason));

		sentryError(namespace)(error);

		return error;
	});
}
