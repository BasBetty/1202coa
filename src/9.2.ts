import { readFile } from 'fs/promises';

import { read10 } from './read10';

const solve = (input: string): number => {
  const rows = input
    .trim()
    .split('\n')
    .map((line: string): number[] => [...line].map(read10));

  let basins: number[] = [];
  const nX = rows[0]!.length;
  const nY = rows.length;
  const visited = new Set();

  const findBasin = (x: number, y: number, limit: number): number => {
    const key = `${x}.${y}`;
    const height = rows[y]![x]!;

    if (height === 9 || limit > height || visited.has(key)) return 0;

    visited.add(key);

    return (
      1 +
      (x > 0 ? findBasin(x - 1, y, height) : 0) +
      (x + 1 < nX ? findBasin(x + 1, y, height) : 0) +
      (y > 0 ? findBasin(x, y - 1, height) : 0) +
      (y + 1 < nY ? findBasin(x, y + 1, height) : 0)
    );
  };

  rows.forEach((row: number[], y: number): void => {
    row.forEach((height: number, x: number): void => {
      if (!(x === 0 || row![x - 1]! > height)) return;
      if (!(x > nX - 2 || row![x + 1]! > height)) return;
      if (!(y === 0 || rows[y - 1]![x]! > height)) return;
      if (!(y > nY - 2 || rows[y + 1]![x]! > height)) return;
      basins.push(findBasin(x, y, rows[y]![x]!));
    });
  });

  const [a, b, c] = basins.sort((a: number, b: number): number => b - a);

  return a! * b! * c!;
};

(async (): Promise<void> => {
  console.log(solve(await readFile('./input/9', 'utf-8')));
})();
