import { readFile } from 'fs/promises';

import { read10 } from './readInt';

const solveA = (input: number[]): number => {
  for (let i = 0; i < 80; i += 1) {
    for (let j = 0; j < input.length; j += 1) {
      if (input[j] === 0) {
        input[j] = 6;
        input.push(9);
      } else {
        input[j] -= 1;
      }
    }
  }

  return input.length;
};

(async (): Promise<void> => {
  const input = await readFile('./input/6', { encoding: 'utf-8' });
  const fish = input.split(',').map(read10);

  const startA = performance.now();
  const solutionA = solveA(fish);
  const endA = performance.now();

  console.log(`A: (${endA - startA}ms) ${solutionA}`);
})();
