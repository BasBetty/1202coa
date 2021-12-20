import { readFile } from 'fs/promises';

type Raw = number | [Raw, Raw];
type Num = [number, number];

export const add = (a: Num[], b: Num[]): Num[] =>
  [...a, ...b].map(([n, d]: Num): Num => [n, d + 1]);

export const flatten = (raw: Raw, depth: number = 0): Num[] =>
  typeof raw === 'number'
    ? [[raw, depth]]
    : [...flatten(raw[0], depth + 1), ...flatten(raw[1], depth + 1)];

export const split = (a: Num[], i: number, [x0, d0]: Num): Num[] => {
  const half = x0 / 2;

  return [
    ...a.slice(0, i),
    [Math.floor(half), d0 + 1],
    [Math.ceil(half), d0 + 1],
    ...a.slice(i + 1),
  ];
};

export const explode = (
  a: Num[],
  i: number,
  [x0, d0]: Num,
  [x1]: Num
): Num[] => {
  if (i !== 0) a[i - 1]![0] += x0;
  if (i !== a.length - 2) a[i + 2]![0] += x1;
  return [...a.slice(0, i), [0, d0 - 1], ...a.slice(i + 2)];
};

export const reduce = (a: Num[]): Num[] => {
  let d = 0;
  let left = false;

  for (let i = 0; i < a.length; i += 1) {
    const n0 = a[i]!;
    const d0 = n0[1];

    left = d === d0 ? !left : d0 > d;
    d = d0;

    if (i !== a.length - 1 && d0 > 4 && left) {
      const n1 = a[i + 1]!;
      const d1 = n1[1];

      if (d0 === d1) return reduce(explode(a, i, n0, n1));
    }
  }

  for (let i = 0; i < a.length; i += 1) {
    const n0 = a[i]!;

    if (n0[0] >= 10) return reduce(split(a, i, n0));
  }

  return a;
};

export const mag = (a: Num[]): number => {
  let d = 0;
  let left = false;

  for (let i = 0; i < a.length; i += 1) {
    const [x0, d0] = a[i]!;

    left = d === d0 ? !left : d0 > d;
    d = d0;

    if (i !== a.length - 1 && left) {
      const [x1, d1] = a[i + 1]!;

      if (d0 === d1)
        return mag([
          ...a.slice(0, i),
          [3 * x0 + 2 * x1, d0 - 1],
          ...a.slice(i + 2),
        ]);
    }
  }

  return a[0]![0]!;
};

(async (): Promise<void> => {
  const input = await readFile('./input/18', 'utf-8');

  const numbers = input
    .trim()
    .split('\n')
    .map((line: string): Num[] => flatten(JSON.parse(line)));

  let max = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < numbers.length; i += 1) {
    for (let j = i + 1; j < numbers.length; j += 1) {
      max = Math.max(
        max,
        mag(reduce(add(numbers[i]!, numbers[j]!))),
        mag(reduce(add(numbers[j]!, numbers[i]!)))
      );
    }
  }

  console.log(max);
})();
