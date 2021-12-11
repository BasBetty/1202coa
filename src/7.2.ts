// see also: ./full/7.2.full.ts
import { readFile } from 'fs/promises';

import { minMax } from './minMax';
import { nFactorials } from './nFactorials';
import { read10 } from './read10';

(async (): Promise<void> => {
  const input = await readFile('./input/7', 'utf-8');
  const positions = input.split(',').map(read10);
  const sum = positions.reduce((sum: number, x: number): number => sum + x);
  const mean = sum / input.length;
  const meanFloor = Math.floor(mean);
  const meanCeil = Math.ceil(mean);
  const { min, max } = minMax(positions);
  const d = max - min;
  const factorials = nFactorials(d);

  const { floor, ceil } = positions.reduce(
    (
      { floor, ceil }: { floor: number; ceil: number },
      x: number
    ): { floor: number; ceil: number } => ({
      floor: floor + factorials[Math.abs(meanFloor - x)]!,
      ceil: ceil + factorials[Math.abs(meanCeil - x)]!,
    }),
    { floor: 0, ceil: 0 }
  );

  console.log(Math.min(floor, ceil));
})();
