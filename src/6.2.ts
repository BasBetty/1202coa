import { readFile } from 'fs/promises';

import { read10 } from './read10';

const solveA = (input: number[]): number => {
  const fish = new Array(10).fill(0);

  for (let i = 0; i < input.length; i += 1) fish[input[i]!] += 1;

  for (let i = 0; i < 256; i += 1) {
    fish[7] += fish[0];
    fish[9] = fish[0];

    for (let j = 1; j < fish.length; j += 1) fish[j - 1] = fish[j];
  }

  let n = 0;

  for (let i = 0; i < fish.length - 1; i += 1) n += fish[i];

  return n;
};

(async (): Promise<void> => {
  const input = await readFile('./input/6', { encoding: 'utf-8' });
  const fish = input.split(',').map(read10);

  const startA = performance.now();
  const solutionA = solveA(fish);
  const endA = performance.now();

  console.log(`A: (${endA - startA}ms) ${solutionA}`);
})();
