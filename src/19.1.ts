import { readFile } from 'fs/promises';

import { read10 } from './read10';

type V3 = [number, number, number];
type Scan = V3[];

const distance = ([x0, y0, z0]: V3, [x1, y1, z1]: V3): number =>
  Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2 + (z0 - z1) ** 2);

const sub = ([x0, y0, z0]: V3, [x1, y1, z1]: V3): V3 => [
  x0 - x1,
  y0 - y1,
  z0 - z1,
];

const equal = ([x0, y0, z0]: V3, [x1, y1, z1]: V3): boolean =>
  x0 === x1 && y0 === y1 && z0 === z1;

const align = (ref: Scan, scan: Scan): Scan | null => {
  for (const i of ref) {
    const distRef = new Map<number, V3>();

    for (const j of ref) {
      const d = distance(j, i);
      if (d !== 0) distRef.set(d, j);
    }

    for (const k of scan) {
      let overlap = 0;

      for (const l of scan) {
        const distScan = distance(l, k);

        if (distRef.has(distScan)) {
          overlap += 1;

          if (overlap === 11) {
            const a = sub(distRef.get(distScan)!, i);
            const b = sub(l, k);

            const getAxis =
              (axis: 0 | 1 | 2): ((beacon: V3) => number) =>
              ([x, y, z]: V3): number => {
                if (a[axis] === b[0]) return x;
                if (a[axis] === -b[0]) return -x;
                if (a[axis] === b[1]) return y;
                if (a[axis] === -b[1]) return -y;
                return a[axis] === b[2] ? z : -z;
              };

            const getX = getAxis(0);
            const getY = getAxis(1);
            const getZ = getAxis(2);

            const offsetX = getX(k) - i[0];
            const offsetY = getY(k) - i[1];
            const offsetZ = getZ(k) - i[2];

            return scan.map(
              (beacon: V3): V3 => [
                getX(beacon) - offsetX,
                getY(beacon) - offsetY,
                getZ(beacon) - offsetZ,
              ]
            );
          }
        }
      }
    }
  }

  return null;
};

const parseBeacon = (l: string): V3 => l.split(',').map(read10) as V3;

(async (): Promise<void> => {
  const input = await readFile('./input/19', 'utf-8');
  const blocks = input.trim().split('\n\n');
  const beacons: V3[] = [];

  const todo: Map<number, Scan> = blocks.reduce(
    (acc: Map<number, Scan>, block: string, i: number): Map<number, V3[]> =>
      acc.set(i, block.split('\n').slice(1).map(parseBeacon)),
    new Map()
  );

  const ref0 = todo.get(0)!;

  const solve = (ref: Scan): void => {
    if (todo.size === 0) return;

    for (const [i, scan] of todo) {
      const alignment = align(ref, scan);

      if (alignment !== null) {
        for (const a of alignment)
          if (!beacons.some((b: V3): boolean => equal(a, b))) beacons.push(a);

        todo.delete(i);
        solve(alignment);
      }
    }
  };

  solve(ref0);

  console.log(beacons.length);
})();
