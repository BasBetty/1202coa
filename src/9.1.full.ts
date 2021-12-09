import { readFile } from 'fs/promises';

import { read10 } from './read10';

const solve = (input: string): number => {
  const rows = input
    .trim()
    .split('\n')
    .map((line: string): number[] => [...line].map(read10));

  const nX = rows[0]!.length;
  const nY = rows.length;

  let sum = 0;

  rows.forEach((row: number[], y: number): void => {
    row.forEach((height: number, x: number): void => {
      if (
        (x === 0 || row![x - 1]! > height) &&
        (x > nX - 2 || row![x + 1]! > height) &&
        (y === 0 || rows[y - 1]![x]! > height) &&
        (y > nY - 2 || rows[y + 1]![x]! > height)
      ) {
        sum += height + 1;
      }
    });
  });

  return sum;
};

(async (): Promise<void> => {
  const input = await readFile('./input/9', 'utf-8');

  const start = performance.now();
  const solution = solve(input);
  const end = performance.now();

  console.log(`(${end - start}ms) ${solution}`);
})();
