import { readFile } from 'fs/promises';

(async (): Promise<void> => {
  const input = await readFile('./input/14', 'utf-8');
  const [template, ruleBlock] = input.split('\n\n');
  const rules = new Map<string, string>();
  const counts = new Map<string, number>();
  let pairs = new Map<string, number>();

  for (let i = 0; i < template!.length; i += 1) {
    const pair = `${template![i]}${template![i + 1]}`;
    pairs.set(pair, (pairs.get(pair) ?? 0) + 1);
  }

  for (const element of template!)
    counts.set(element, (counts.get(element) ?? 0) + 1);

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
        const pair1 = `${a}${b}`;
        const pair2 = `${b}${c}`;
        counts.set(b, (counts.get(b) ?? 0) + count);
        newPairs.set(pair1, (newPairs.get(pair1) ?? 0) + count);
        newPairs.set(pair2, (newPairs.get(pair2) ?? 0) + count);
      } else {
        newPairs.set(pair, (newPairs.get(pair) ?? 0) + count);
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
