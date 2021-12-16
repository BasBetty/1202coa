// see also: ./full/15.1.full.ts
import { read10 } from './read10';
import { readLines } from './readLines';

(async (): Promise<void> => {
  const lines = await readLines('./input/15');
  const size = lines.length;
  const risks = new Map<number, Map<number, number>>();
  const paths = new Map<number, Map<number, number>>();

  lines.forEach((line: string, y: number): void => {
    [...line!].forEach((rawRisk: string, x: number): void => {
      const risk = read10(rawRisk);
      risks.set(x!, (risks.get(x) ?? new Map()).set(y, risk));
      paths.set(x!, (paths.get(x) ?? new Map()).set(y, risk));
    });
  });

  const updatePath = (x: number, y: number, adjacentRisk: number): void => {
    if (x < 0 || x > size - 1 || y < 0 || y > size - 1) return;
    const updated = adjacentRisk + risks.get(x)!.get(y)!;
    if (updated < paths.get(x)!.get(y)!) setPath(x, y, updated);
  };

  const setPath = (x: number, y: number, newRisk: number): void => {
    paths.set(x, paths.get(x)!.set(y, newRisk));
    if (x > 0) updatePath(x - 1, y, newRisk);
    if (y > 0) updatePath(x, y - 1, newRisk);
    if (x < size - 1) updatePath(x + 1, y, newRisk);
    if (y < size - 1) updatePath(x, y + 1, newRisk);
  };

  const incPath = (x: number, y: number, increment: number): void =>
    setPath(x, y, risks.get(x)!.get(y)! + increment);

  for (let n = 1; n < size; n += 1) {
    for (let i = 0; i <= n; i += 1) {
      const a = paths.get(n - 1)!.get(i)!;
      const c = paths.get(i)!.get(n - 1)!;

      incPath(n, i, i === 0 ? a : Math.min(a, paths.get(n)!.get(i - 1)!));
      incPath(i, n, i === 0 ? c : Math.min(c, paths.get(i - 1)!.get(n)!));
    }

    incPath(
      n,
      n,
      Math.min(paths.get(n - 1)!.get(n)!, paths.get(n)!.get(n - 1)!)
    );
  }

  console.log(paths.get(size - 1)!.get(size - 1)! - paths.get(0)!.get(0)!);
})();
