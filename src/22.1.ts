import { read10 } from './read10';
import { readLines } from './readLines';

(async (): Promise<void> => {
  interface Step {
    on: boolean;
    x0: number;
    x1: number;
    y0: number;
    y1: number;
    z0: number;
    z1: number;
  }

  const INIT_MIN = -50;
  const INIT_MAX = 50;

  const lines = await readLines('./input/22');
  const steps: Step[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const match =
      /(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/.exec(
        lines[i]!
      );

    const on = match![1] === 'on';
    const x0 = read10(match![2]!);
    const x1 = read10(match![3]!);
    const y0 = read10(match![4]!);
    const y1 = read10(match![5]!);
    const z0 = read10(match![6]!);
    const z1 = read10(match![7]!);

    if (
      (x0 < INIT_MAX || x1 < INIT_MAX) &&
      (y0 < INIT_MAX || y1 < INIT_MAX) &&
      (z0 < INIT_MAX || z1 < INIT_MAX) &&
      (x0 > INIT_MIN || x1 > INIT_MIN) &&
      (y0 > INIT_MIN || y1 > INIT_MIN) &&
      (z0 > INIT_MIN || z1 > INIT_MIN)
    ) {
      steps.push({ on, x0, x1, y0, y1, z0, z1 });
    }
  }

  const initArea = new Set<string>();

  for (const { on, x0, x1, y0, y1, z0, z1 } of steps) {
    for (let x = x0; x <= x1; x += 1) {
      for (let y = y0; y <= y1; y += 1) {
        for (let z = z0; z <= z1; z += 1) {
          if (on) {
            initArea.add(`${x}.${y}.${z}`);
          } else {
            initArea.delete(`${x}.${y}.${z}`);
          }
        }
      }
    }
  }

  console.log(initArea.size);
})();
