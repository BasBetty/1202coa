import { readFile } from 'fs/promises';

import { read10 } from './read10';

const solve = (input: number[]): number => {
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
  const input = await readFile('./input/6', 'utf-8');
  const fish = input.split(',').map(read10);

  const start = performance.now();
  const solution = solve(fish);
  const end = performance.now();

  console.log(`(${end - start}ms) ${solution}`);
})();
