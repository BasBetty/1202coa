import { readFile } from 'fs/promises';

import { read10 } from '../read10';

const solve = (input: number[]): number => {
  const fishes = new Array(10).fill(0);

  input.forEach((fish: number): void => {
    fishes[fish] += 1;
  });

  for (let i = 0; i < 256; i += 1) {
    fishes[7] += fishes[0];
    fishes[9] = fishes[0];

    for (let j = 1; j < fishes.length; j += 1) fishes[j - 1] = fishes[j];
  }

  return fishes.reduce((a: number, b: number): number => a + b);
};

(async (): Promise<void> => {
  const input = await readFile('./input/6', 'utf-8');
  const fish = input.split(',').map(read10);

  const start = performance.now();
  const solution = solve(fish);
  const end = performance.now();

  console.log(`(${end - start}ms) ${solution}`);
})();
