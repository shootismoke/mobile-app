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
import * as C from 'fp-ts/lib/Console';
import * as E from 'fp-ts/lib/Either';
import { Lazy } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { capDelay, limitRetries, RetryStatus } from 'retry-ts';
import { retrying } from 'retry-ts/lib/Task';
import * as Sentry from 'sentry-expo';

/**
 * A side-effect in a TaskEither chain: if the TaskEither fails, still return
 * a TaskEither.RightTask
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

// This Error is always thrown at the beginning of a retry, we ignore it
const EMPTY_OPTION_ERROR = new Error('Empty Option<delay>');

/**
 *
 * @param retries - The number of time to retry
 * @param teFn - A function returning a TE
 */
export function retry<A>(
  retries: number,
  teFn: (status: RetryStatus, delay: number) => TE.TaskEither<Error, A>
): TE.TaskEither<Error, A> {
  return retrying(
    capDelay(2000, limitRetries(retries)), // Do `retries` times max, and set limit to 2s
    status =>
      pipe(
        status.previousDelay,
        O.fold(
          () => TE.left(EMPTY_OPTION_ERROR),
          delay => teFn(status, delay)
        )
      ),
    either => E.isLeft(either)
  );
}

/**
 * Tasks and IOs can sometimes throw unexpectedly, so we catch and log here.
 * This should realistically never happen.
 */
export function logFpError(namespace: string) {
  return function(error: Error): void {
    console.log(`<${namespace}> - ${error.message}`);

    if (Constants.manifest.releaseChannel === 'production') {
      Sentry.captureException(error);
    }
  };
}

/**
 * Convert a Promise<A> into a TaskEither<Error, A>
 * @param fn - Function returning a Promise
 */
export function promiseToTE<A>(fn: Lazy<Promise<A>>): TE.TaskEither<Error, A> {
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

    logFpError('promiseToTE')(error);

    return error;
  });
}
