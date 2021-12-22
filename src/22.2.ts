import { read10 } from './read10';
import { readLines } from './readLines';

interface Cuboid {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  z0: number;
  z1: number;
}

type Step = Cuboid & { on: boolean };

export const cuboidSize = ({ x0, x1, y0, y1, z0, z1 }: Cuboid): number =>
  (x1 - x0 + 1) * (y1 - y0 + 1) * (z1 - z0 + 1);

export const countCubes = (cuboids: Cuboid[]): number =>
  cuboids.reduce(
    (acc: number, cuboid: Cuboid): number => acc + cuboidSize(cuboid),
    0
  );

export const isectV2 = (
  a0: number,
  a1: number,
  b0: number,
  b1: number
): [number, number] | null => {
  const c0 = Math.max(a0, b0);
  const c1 = Math.min(a1, b1);
  return c0 > c1 ? null : [c0, c1];
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

export const turnOff = (a: Cuboid, off: Cuboid): Cuboid[] => {
  const isectionX = isectV2(a.x0, a.x1, off.x0, off.x1);
  const isectionY = isectV2(a.y0, a.y1, off.y0, off.y1);
  const isectionZ = isectV2(a.z0, a.z1, off.z0, off.z1);

  if (isectionX === null || isectionY === null || isectionZ === null)
    return [a];

  const [x0, x1] = isectionX;
  const [y0, y1] = isectionY;
  const [z0, z1] = isectionZ;
  const isection: Cuboid = { x0, x1, y0, y1, z0, z1 };

  return [
    ...makeTop(a, isection),
    ...makeBottom(a, isection),
    ...makeLeft(a, isection),
    ...makeRight(a, isection),
    ...makeFront(a, isection),
    ...makeBack(a, isection),
  ];
};

(async (): Promise<void> => {
  const lines = await readLines('./input/22');
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

  console.log(countCubes(reactor));
})();
