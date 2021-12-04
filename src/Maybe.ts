type Nothing = undefined;

interface Just<T> {
  just: T;
}

type Maybe<T> = Nothing | Just<T>;
