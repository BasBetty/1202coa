import { readFile } from 'fs/promises';

import { incrementMap } from './incrementMap';

(async (): Promise<void> => {
  const input = await readFile('./input/14', 'utf-8');
  const [template, ruleBlock] = input.split('\n\n');
  const rules = new Map<string, string>();
  const counts = new Map<string, number>();
  let polymer = template!.split('');

  for (const line of ruleBlock!.split('\n')) {
    const [pair, element] = line.split(' -> ');
    rules.set(pair!, element!);
  }

  for (let step = 0; step < 1; step += 1) {
    const newPoly: string[] = [];
    const m = polymer.length - 1;

    for (let i = 0; i < m; i += 1) {
      const a = polymer[i]!;
      const b = polymer[i + 1]!;
      const pair = `${a}${b}`;

      newPoly.push(a);
      if (rules.has(pair)) newPoly.push(rules.get(pair)!);
      if (m - i === 1) newPoly.push(b);
    }

    polymer = newPoly;
  }

  for (const element of polymer) incrementMap(counts, element, 1);

  let max = Number.NEGATIVE_INFINITY;
  let min = Number.POSITIVE_INFINITY;

  for (const [, n] of counts) {
    if (n > max) max = n;
    if (n < min) min = n;
  }

  console.log(max - min);
})();
