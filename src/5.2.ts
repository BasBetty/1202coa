// see also: ./full/5.2.full.ts
import { read10 } from './read10';
import { readLines } from './readLines';

(async (): Promise<void> => {
  const input = await readLines('./input/5');
  const points = new Map<string, number>();

  for (let i = 0; i < input.length; i += 1) {
    const [, x1s, y1s, x2s, y2s] = /(\d+),(\d+) -> (\d+),(\d+)/.exec(
      input[i]!
    )!;

    const x1 = read10(x1s!);
    const x2 = read10(x2s!);
    const y1 = read10(y1s!);
    const y2 = read10(y2s!);

    const dx = x1 - x2;
    const dy = y1 - y2;
    const n = Math.max(Math.abs(dx), Math.abs(dy));
    const xSign = Math.sign(dx);
    const ySign = Math.sign(dy);

    for (let i = 0; i <= n; i += 1) {
      const x = x1 - i * xSign;
      const y = y1 - i * ySign;
      const key = `${x},${y}`;

      points.set(key, points.has(key) ? points.get(key)! + 1 : 1);
    }
  }

  console.log(
    [...points.values()].reduce((sum: number, x: number): number =>
      sum + x >= 2 ? 1 : 0
    )
  );
})();
