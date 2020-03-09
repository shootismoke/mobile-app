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

import * as C from 'fp-ts/lib/Console';
import * as E from 'fp-ts/lib/Either';
import { Lazy } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import {
  capDelay,
  exponentialBackoff,
  limitRetries,
  monoidRetryPolicy,
  RetryStatus
} from 'retry-ts';
import { retrying } from 'retry-ts/lib/Task';

import { sentryError } from './sentry';

/**
 * A side-effect in a TaskEither chain: if the TaskEither fails, still return
 * a TaskEither.Right
 *
 * @example
 * ```
 * function myTe(value: number) { // A TaskEither };
 *
 * pipe(
 *   TE.of(1),
 *   TE.chain(sideEffect(myTe)
 * )
 * ```
 */
export function sideEffect<E, A>(fn: (input: A) => TE.TaskEither<E, void>) {
  return (input: A): TE.TaskEither<E, A> =>
    TE.rightTask<E, A>(
      pipe(
        fn(input),
        TE.fold(
          error =>
            pipe(
              T.fromIO(C.log(error)),
              T.map(() => input)
            ),
          () => T.of(input)
        )
      )
    );
}

interface RetryOptions {
  capDelay?: number;
  exponentialBackoff?: number;
  retries?: number;
}

/**
 * Retry a TaskEither
 *
 * @param retries - The number of time to retry
 * @param teFn - A function returning a TE
 */
export function retry<A>(
  teFn: (status: RetryStatus, delay: number) => TE.TaskEither<Error, A>,
  options: RetryOptions = {}
): TE.TaskEither<Error, A> {
  // Set our retry policy
  const policy = capDelay(
    options.capDelay || 2000,
    monoidRetryPolicy.concat(
      exponentialBackoff(options.exponentialBackoff || 200),
      limitRetries(options.retries || 3)
    )
  );

  return retrying(
    policy,
    status =>
      pipe(
        status.previousDelay,
        O.fold(
          () => TE.left(new Error('Empty Option<delay>')),
          delay => teFn(status, delay)
        )
      ),
    E.isLeft
  );
}

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
    let error: Error | undefined;
    // FIXME GraphQLError is empty
    // https://github.com/apollographql/apollo-client/issues/2810#issuecomment-401738389
    if (
      reason.networkError &&
      reason.networkError.result &&
      reason.networkError.result.errors &&
      reason.networkError.result.errors[0]
    ) {
      error = new Error(reason.networkError.result.errors[0].message);
    } else {
      error = reason instanceof Error ? reason : new Error(String(reason));
    }

    sentryError(namespace)(error);

    return error;
  });
}
