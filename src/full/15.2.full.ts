import { read10 } from '../read10';
import { readLines } from '../readLines';

const solve = (lines: string[]): number => {
  const risks = new Map<number, Map<number, number>>();
  const paths = new Map<number, Map<number, number>>();
  const size = lines.length;
  const sizeScaled = size * 5;

  lines.forEach((line: string, col: number): void => {
    [...line!].forEach((rawRisk: string, row: number): void => {
      const value = read10(rawRisk);

      for (let i = 0; i < 5; i += 1) {
        const x = size * i + row;

        for (let j = 0; j < 5; j += 1) {
          const y = size * j + col;
          const valueScaled = value + i + j;
          const valueMod = valueScaled > 9 ? valueScaled % 9 : valueScaled;

          risks.set(x, (risks.get(x) ?? new Map()).set(y, valueMod));
          paths.set(x, (paths.get(x) ?? new Map()).set(y, valueMod));
        }
      }
    });
  });

  const updatePath = (x: number, y: number, adjacentRisk: number): void => {
    const updated = adjacentRisk + risks.get(x)!.get(y)!;

    if (updated < paths.get(x)!.get(y)!) setPath(x, y, updated);
  };

  const incPath = (x: number, y: number, increment: number): void =>
    setPath(x, y, risks.get(x)!.get(y)! + increment);

  const setPath = (x: number, y: number, newRisk: number): void => {
    paths.set(x, paths.get(x)!.set(y, newRisk));
    if (x > 0) updatePath(x - 1, y, newRisk);
    if (y > 0) updatePath(x, y - 1, newRisk);
    if (x < size - 1) updatePath(x + 1, y, newRisk);
    if (y < size - 1) updatePath(x, y + 1, newRisk);
  };

  for (let n = 1; n < sizeScaled; n += 1) {
    for (let i = 0; i < n; i += 1) {
      const a = paths.get(n - 1)!.get(i)!;
      const b = i === 0 ? a : Math.min(a, paths.get(n)!.get(i - 1)!);
      const c = paths.get(i)!.get(n - 1)!;
      const d = i === 0 ? c : Math.min(c, paths.get(i - 1)!.get(n)!);

      incPath(n, i, b);
      incPath(i, n, d);
    }

    incPath(
      n,
      n,
      Math.min(paths.get(n - 1)!.get(n)!, paths.get(n)!.get(n - 1)!)
    );
  }

  return (
    paths.get(sizeScaled - 1)!.get(sizeScaled - 1)! - paths.get(0)!.get(0)!
  );
};

(async (): Promise<void> => {
  const input = await readLines('./input/15');

  const start = performance.now();
  const solution = solve(input);
  const end = performance.now();

  console.log(`(${end - start}ms) ${solution}`);
})();
