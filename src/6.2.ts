// see also: ./full/6.2.full.ts
import { readFile } from 'fs/promises';

import { read10 } from './read10';

(async (): Promise<void> => {
  const input = await readFile('./input/6', 'utf-8');
  const initialFishes = input.split(',').map(read10);
  const fishes = new Array(10).fill(0);

  initialFishes.forEach((fish: number): void => {
    fishes[fish] += 1;
  });

  for (let i = 0; i < 256; i += 1) {
    fishes[7] += fishes[0];
    fishes[9] = fishes[0];

    for (let j = 1; j < fishes.length; j += 1) fishes[j - 1] = fishes[j];
  }

  console.log(fishes.reduce((a: number, b: number): number => a + b));
})();
