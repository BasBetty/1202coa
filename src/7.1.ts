// see also: ./full/7.1.full.ts
import { readFile } from 'fs/promises';

import { minMax } from './minMax';
import { read10 } from './read10';

(async (): Promise<void> => {
  const input = await readFile('./input/7', 'utf-8');
  const positions = input.split(',').map(read10);
  const { min, max } = minMax(positions);
  let answer = Number.MAX_SAFE_INTEGER;

  for (let i = min; i <= max; i += 1) {
    let diff = 0;

    for (let j = 0; j < input.length; j += 1)
      diff += Math.abs(i - positions[j]!);

    if (diff < answer) answer = diff;
  }

  console.log(answer);
})();
