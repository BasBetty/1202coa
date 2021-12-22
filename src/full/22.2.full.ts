import { read10 } from '../read10';
import { readLines } from '../readLines';

interface Cuboid {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  z0: number;
  z1: number;
}

type Step = Cuboid & { on: boolean };

export const countCubes = (cuboids: Cuboid[]): number =>
  cuboids.reduce(
    (acc: number, { x0, x1, y0, y1, z0, z1 }: Cuboid): number =>
      acc + (x1 - x0 + 1) * (y1 - y0 + 1) * (z1 - z0 + 1),
    0
  );

export const intersect = (a: Cuboid, b: Cuboid): Cuboid | null => {
  const x0 = Math.max(a.x0, b.x0);
  const x1 = Math.min(a.x1, b.x1);
  if (x0 > x1) return null;
  const y0 = Math.max(a.y0, b.y0);
  const y1 = Math.min(a.y1, b.y1);
  if (y0 > y1) return null;
  const z0 = Math.max(a.z0, b.z0);
  const z1 = Math.min(a.z1, b.z1);
  return z0 > z1 ? null : { x0, x1, y0, y1, z0, z1 };
};

export const makeTop = (a: Cuboid, b: Cuboid): Cuboid[] =>
  b.z1 >= a.z1 ? [] : [{ ...b, z0: b.z1 + 1, z1: a.z1 }];

export const makeBottom = (a: Cuboid, b: Cuboid): Cuboid[] =>
  b.z0 <= a.z0 ? [] : [{ ...b, z0: a.z0, z1: b.z0 - 1 }];

export const makeFront = (a: Cuboid, b: Cuboid): Cuboid[] =>
  b.y1 >= a.y1 ? [] : [{ ...a, y0: b.y1 + 1 }];

export const makeBack = (a: Cuboid, b: Cuboid): Cuboid[] =>
  b.y0 <= a.y0 ? [] : [{ ...a, y1: b.y0 - 1 }];

export const makeRight = (a: Cuboid, b: Cuboid): Cuboid[] =>
  b.x1 >= a.x1
    ? []
    : [
        {
          ...a,
          x0: b.x1 + 1,
          y0: Math.max(a.y0, b.y0),
          y1: Math.min(a.y1, b.y1),
        },
      ];

export const makeLeft = (a: Cuboid, b: Cuboid): Cuboid[] =>
  b.x0 <= a.x0
    ? []
    : [
        {
          ...a,
          x1: b.x0 - 1,
          y0: Math.max(a.y0, b.y0),
          y1: Math.min(a.y1, b.y1),
        },
      ];

const turnOff = (a: Cuboid, b: Cuboid): Cuboid[] => {
  const c = intersect(a, b);

  return c === null
    ? [a]
    : [
        ...makeTop(a, c),
        ...makeBottom(a, c),
        ...makeLeft(a, c),
        ...makeRight(a, c),
        ...makeFront(a, c),
        ...makeBack(a, c),
      ];
};

const solve = (lines: string[]): number => {
  const n = lines.length;
  const steps: Step[] = new Array(n);

  for (let i = 0; i < n; i += 1) {
    const match =
      /(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/.exec(
        lines[i]!
      );

    steps[i] = {
      on: match![1] === 'on',
      x0: read10(match![2]!),
      x1: read10(match![3]!),
      y0: read10(match![4]!),
      y1: read10(match![5]!),
      z0: read10(match![6]!),
      z1: read10(match![7]!),
    };
  }

  const reactor = steps.reduce(
    (reactor: Cuboid[], { on, ...cuboid }: Step): Cuboid[] => {
      const updated = reactor.flatMap((a: Cuboid): Cuboid[] =>
        turnOff(a, cuboid)
      );

      return on ? [...updated, cuboid] : updated;
    },
    []
  );

  return countCubes(reactor);
};

(async (): Promise<void> => {
  const lines = await readLines('./input/22');

  const start = performance.now();
  const solution = solve(lines);
  const end = performance.now();

  console.log(`(${end - start}ms) ${solution}`);
})();
