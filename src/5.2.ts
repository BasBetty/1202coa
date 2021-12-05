import { read10 } from './readInt';
import { readLines } from './readLines';

const solveA = (input: string[]): number => {
  const points = new Map<string, number>();

  for (let i = 0; i < input.length; i += 1) {
    const [a, b] = input[i]!.split(' -> ');
    const [x1string, y1string] = a!.split(',');
    const [x2string, y2string] = b!.split(',');

    const x1 = read10(x1string!);
    const x2 = read10(x2string!);
    const y1 = read10(y1string!);
    const y2 = read10(y2string!);

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

  let n = 0;

  const values = [...points.values()];

  for (let i = 0; i < points.size; i += 1) if (values[i]! >= 2) n += 1;

  return n;
};

(async (): Promise<void> => {
  const input = await readLines('./input/5');

  const startA = performance.now();
  const solutionA = solveA(input);
  const endA = performance.now();

  console.log(`A: (${endA - startA}ms) ${solutionA}`);
})();
