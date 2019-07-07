import * as E from 'fp-ts/lib/Either';
import * as IO from 'fp-ts/lib/IO';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { capDelay, limitRetries, RetryStatus } from 'retry-ts';
import { retrying } from 'retry-ts/lib/Task';

import { noop } from './noop';

/**
 * Run function `fn()` as a side-effect, return `returnValue`
 */
export function sideEffect<T>(fn: () => any, returnValue: T) {
  fn();
  return IO.of(returnValue);
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
) {
  return retrying(
    capDelay(2000, limitRetries(retries)), // Do `retries` times max, and set limit to 2s
    status =>
      pipe(
        status.previousDelay,
        O.fold(() => TE.left(EMPTY_OPTION_ERROR), delay => teFn(status, delay))
      ),
    e => {
      E.fold<Error, unknown, void>(err => {
        // Is there a better way to log errors?
        // https://github.com/gcanti/retry-ts/issues/5#issuecomment-509005090
        if (err !== EMPTY_OPTION_ERROR) {
          console.log(`<retry> - Error ${err.message}`);
        }
      }, noop)(e);

      return E.isLeft(e);
    }
  );
}
