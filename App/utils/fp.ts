import * as io from 'fp-ts/lib/IO';

/**
 * Run function `fn()` as a side-effect, return `returnValue`
 */
export function sideEffect<T>(fn: () => any, returnValue: T) {
  fn();
  return io.of(returnValue);
}
