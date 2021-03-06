import { read10 } from '../read10';
import { readLines } from '../readLines';

const solve = (input: string[]): number => {
  const rows = input.map((line: string): number[] => [...line].map(read10));
  const nX = rows[0]!.length;

  return rows.reduce(
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
  );
};

(async (): Promise<void> => {
  const input = await readLines('./input/9');

  const start = performance.now();
  const solution = solve(input);
  const end = performance.now();

  console.log(`(${end - start}ms) ${solution}`);
})();
