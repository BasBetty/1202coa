// see also: ./full/6.1.full.ts
import { readFile } from 'fs/promises';

import { read10 } from './read10';

(async (): Promise<void> => {
  const input = await readFile('./input/6', 'utf-8');
  const fishes = input.split(',').map(read10);

  for (let i = 0; i < 80; i += 1) {
    for (let j = 0; j < input.length; j += 1) {
      if (fishes[j] === 0) {
        fishes[j] = 6;
        fishes.push(9);
      } else {
        fishes[j] -= 1;
      }
    }
  }

  console.log(fishes.length);
})();
