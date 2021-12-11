// see also: ./full/9.2.full.ts
import { read10 } from './read10';
import { readLines } from './readLines';

(async (): Promise<void> => {
  const input = await readLines('./input/9');
  const rows = input.map((line: string): number[] => [...line].map(read10));
  const nX = rows[0]!.length;
  const nY = rows.length;
  const visited = new Set();

  const basinSize = (x: number, y: number, limit: number): number => {
    const key = `${x}.${y}`;
    const height = rows[y]![x]!;

    if (height === 9 || limit > height || visited.has(key)) return 0;

    visited.add(key);

    return (
      1 +
      (x > 0 ? basinSize(x - 1, y, height) : 0) +
      (x + 1 < nX ? basinSize(x + 1, y, height) : 0) +
      (y > 0 ? basinSize(x, y - 1, height) : 0) +
      (y + 1 < nY ? basinSize(x, y + 1, height) : 0)
    );
  };

  const [a, b, c] = rows
    .flatMap((row: number[], y: number): number[] =>
      row.flatMap((height: number, x: number): number[] =>
        (x === 0 || row![x - 1]! > height) &&
        (x > nX - 2 || row![x + 1]! > height) &&
        (y === 0 || rows[y - 1]![x]! > height) &&
        (y > nY - 2 || rows[y + 1]![x]! > height)
          ? [basinSize(x, y, rows[y]![x]!)]
          : []
      )
    )
    .sort((a: number, b: number): number => b - a);

  console.log(a! * b! * c!);
})();
