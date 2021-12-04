export const Nothing = undefined;

export interface Just<T> {
  just: T;
}

export type Maybe<T> = typeof Nothing | Just<T>;
