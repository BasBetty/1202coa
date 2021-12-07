import { readFile } from 'fs/promises';

import { minMax } from './minMax';
import { read10 } from './readInt';

const solveA = (input: number[]): number => {
  const min = Math.min(...input);
  const max = Math.max(...input);
  let answer = Number.MAX_SAFE_INTEGER;

  for (let i = min; i <= max; i += 1) {
    let diff = 0;

    for (let j = 0; j < input.length; j += 1) diff += Math.abs(i - input[j]!);

    if (diff < answer) answer = diff;
  }

  return answer;
};

const solveB = (input: number[]): number => {
  const { min, max } = minMax(input);
  let answer = Number.MAX_SAFE_INTEGER;

  for (let i = min; i <= max; i += 1) {
    let diff = 0;

    for (let j = 0; j < input.length; j += 1) diff += Math.abs(i - input[j]!);

    if (diff < answer) answer = diff;
  }

  return answer;
};

(async (): Promise<void> => {
  const input = await readFile('./input/7', { encoding: 'utf-8' });
  const positions = input.split(',').map(read10);

  const startA = performance.now();
  const solutionA = solveA(positions);
  const endA = performance.now();

  console.log(`A: (${endA - startA}ms) ${solutionA}`);

  const startB = performance.now();
  const solutionB = solveB(positions);
  const endB = performance.now();

  console.log(`B: (${endB - startB}ms) ${solutionB}`);
})();
