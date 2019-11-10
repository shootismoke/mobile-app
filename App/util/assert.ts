export function assertIsDefined<T>(val: T, msg: string): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
      throw new Error(msg);
  }
}
