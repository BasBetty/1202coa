import { readFile } from 'fs/promises';

import { incrementMap } from './incrementMap';

(async (): Promise<void> => {
  const input = await readFile('./input/14', 'utf-8');
  const [template, ruleBlock] = input.split('\n\n');
  const rules = new Map<string, string>();
  const counts = new Map<string, number>();
  let pairs = new Map<string, number>();

  for (let i = 0; i < template!.length; i += 1)
    incrementMap(pairs, `${template![i]}${template![i + 1]}`, 1);

  for (const element of template!) incrementMap(counts, element, 1);

  for (const line of ruleBlock!.split('\n')) {
    const [pair, element] = line.split(' -> ');
    rules.set(pair!, element!);
  }

  for (let step = 0; step < 40; step += 1) {
    const newPairs = new Map<string, number>();

    for (const [pair, count] of pairs) {
      if (rules.has(pair)) {
        const [a, c] = pair;
        const b = rules.get(pair)!;
        incrementMap(counts, b, count);
        incrementMap(newPairs, `${a}${b}`, count);
        incrementMap(newPairs, `${b}${c}`, count);
      } else {
        incrementMap(newPairs, pair, count);
      }
    }

    pairs = newPairs;
  }

  let max = Number.NEGATIVE_INFINITY;
  let min = Number.POSITIVE_INFINITY;

  for (const [, n] of counts) {
    if (n > max) max = n;
    if (n < min) min = n;
  }

  console.log(max - min);
})();
