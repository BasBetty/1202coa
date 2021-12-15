import { read10 } from './read10';
import { readLines } from './readLines';

const solve = (lines: string[]): number => {
  const size = lines.length;
  const map = new Map<number, Map<number, number>>();
  const minRisks = new Map<number, Map<number, number>>();

  lines.forEach((line: string, y: number): void => {
    [...line!].forEach((rawRisk: string, x: number): void => {
      const risk = read10(rawRisk);
      map.set(x!, (map.get(x) ?? new Map()).set(y, risk));
      minRisks.set(x!, (minRisks.get(x) ?? new Map()).set(y, risk));
    });
  });

  const setMinRisk = (x: number, y: number, newRisk: number): void => {
    minRisks.set(x, minRisks.get(x)!.set(y, newRisk));

    if (x > 0) {
      const left = map.get(x - 1)!.get(y)!;
      const newLeft = newRisk + left;

      if (newLeft < minRisks.get(x - 1)!.get(y)!) setMinRisk(x - 1, y, newLeft);
    }

    if (y > 0) {
      const up = map.get(x)!.get(y - 1)!;
      const newUp = newRisk + up;

      if (newUp < minRisks.get(x)!.get(y - 1)!) setMinRisk(x, y - 1, newUp);
    }

    if (x < size - 1) {
      const right = map.get(x + 1)!.get(y)!;
      const newRight = newRisk + right;

      if (newRight < minRisks.get(x + 1)!.get(y)!)
        setMinRisk(x + 1, y, newRight);
    }

    if (y < size - 1) {
      const down = map.get(x)!.get(y + 1)!;
      const newDown = newRisk + down;

      if (newDown < minRisks.get(x)!.get(y + 1)!) setMinRisk(x, y + 1, newDown);
    }
  };

  const incMinRisk = (x: number, y: number, increment: number): void =>
    setMinRisk(x, y, map.get(x)!.get(y)! + increment);

  for (let n = 1; n < size; n += 1) {
    for (let i = 0; i < n; i += 1) {
      const a = minRisks.get(n - 1)!.get(i)!;
      const b = i === 0 ? a : Math.min(a, minRisks.get(n)!.get(i - 1)!);
      const c = minRisks.get(i)!.get(n - 1)!;
      const d = i === 0 ? c : Math.min(c, minRisks.get(i - 1)!.get(n)!);

      incMinRisk(n, i, b);
      incMinRisk(i, n, d);
    }

    incMinRisk(
      n,
      n,
      Math.min(minRisks.get(n - 1)!.get(n)!, minRisks.get(n)!.get(n - 1)!)
    );
  }

  return minRisks.get(size - 1)!.get(size - 1)! - minRisks.get(0)!.get(0)!;
};

(async (): Promise<void> => {
  const input = await readLines('./input/15');
  console.log(solve(input));
})();
