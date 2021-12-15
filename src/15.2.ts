import { read10 } from './read10';
import { readLines } from './readLines';

const solve = (lines: string[]): number => {
  const map = new Map<number, Map<number, number>>();
  const minRisks = new Map<number, Map<number, number>>();
  const size = lines.length;
  const sizeScaled = size * 5;

  lines.forEach((line: string, y: number): void => {
    [...line!].forEach((rawRisk: string, x: number): void => {
      const value = read10(rawRisk);

      for (let i = 0; i < 5; i += 1) {
        const xScaled = size * i + x;

        for (let j = 0; j < 5; j += 1) {
          const yScaled = size * j + y;
          let valueScaled = value + i + j;
          if (valueScaled > 9) valueScaled = valueScaled % 9;

          map.set(
            xScaled,
            (map.get(xScaled) ?? new Map()).set(yScaled, valueScaled)
          );

          minRisks.set(
            xScaled,
            (minRisks.get(xScaled) ?? new Map()).set(yScaled, valueScaled)
          );
        }
      }
    });
  });

  const setMinRisk = (x: number, y: number, newRisk: number): void => {
    minRisks.set(x, minRisks.get(x)!.set(y, newRisk));

    if (x > 0) {
      const left = map.get(x - 1)!.get(y)!;
      const minLeft = minRisks.get(x - 1)!.get(y)!;
      const newLeft = newRisk + left;

      if (newLeft < minLeft) setMinRisk(x - 1, y, newLeft);
    }

    if (y > 0) {
      const up = map.get(x)!.get(y - 1)!;
      const minUp = minRisks.get(x)!.get(y - 1)!;
      const newUp = newRisk + up;

      if (newUp < minUp) setMinRisk(x, y - 1, newUp);
    }

    if (x < sizeScaled - 1) {
      const right = map.get(x + 1)!.get(y)!;
      const minRight = minRisks.get(x + 1)!.get(y)!;
      const newRight = newRisk + right;

      if (newRight < minRight) setMinRisk(x + 1, y, newRight);
    }

    if (y < sizeScaled - 1) {
      const down = map.get(x)!.get(y + 1)!;
      const minDown = minRisks.get(x)!.get(y + 1)!;
      const newDown = newRisk + down;

      if (newDown < minDown) setMinRisk(x, y + 1, newDown);
    }
  };

  const incMinRisk = (x: number, y: number, increment: number): void =>
    setMinRisk(x, y, map.get(x)!.get(y)! + increment);

  for (let n = 1; n < sizeScaled; n += 1) {
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

  return (
    minRisks.get(sizeScaled - 1)!.get(sizeScaled - 1)! -
    minRisks.get(0)!.get(0)!
  );
};

(async (): Promise<void> => {
  const input = await readLines('./input/15');

  //   const input = `
  // 1163751742
  // 1381373672
  // 2136511328
  // 3694931569
  // 7463417111
  // 1319128137
  // 1359912421
  // 3125421639
  // 1293138521
  // 2311944581
  //           `
  //     .trim()
  //     .split('\n');

  //   const input = `
  // 00000
  // 99990
  // 00000
  // 09999
  // 00000
  //         `
  //     .trim()
  //     .split('\n');

  console.log(solve(input));
})();
