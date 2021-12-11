// see also: ./full/9.1.full.ts
import { readFile } from 'fs/promises';

import { read10 } from './read10';

(async (): Promise<void> => {
  const input = await readFile('./input/9', 'utf-8');

  const rows = input
    .trim()
    .split('\n')
    .map((line: string): number[] => [...line].map(read10));

  const nX = rows[0]!.length;

  console.log(
    rows.reduce(
      (sum: number, row: number[], y: number): number =>
        sum +
        row.reduce(
          (rowSum: number, height: number, x: number): number =>
            rowSum +
            ((x === 0 || row![x - 1]! > height) &&
            (x > nX - 2 || row![x + 1]! > height) &&
            (y === 0 || rows[y - 1]![x]! > height) &&
            (y > rows.length - 2 || rows[y + 1]![x]! > height)
              ? height + 1
              : 0),
          0
        ),
      0
    )
  );
})();
