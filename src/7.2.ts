import { readFile } from 'fs/promises';

import { minMax } from './minMax';
import { read10 } from './readInt';

const solveA = (input: number[]): number => {
  const min = Math.min(...input);
  const max = Math.max(...input);
  let answer = Number.MAX_SAFE_INTEGER;

  for (let i = min; i <= max; i += 1) {
    let diff = 0;

    for (let j = 0; j < input.length; j += 1)
      for (let k = Math.abs(i - input[j]!); k >= 1; k -= 1) diff += k;

    if (diff < answer) answer = diff;
  }

  return answer;
};

const solveB = (input: number[]): number => {
  const { min, max } = minMax(input);

  let answer = Number.MAX_SAFE_INTEGER;

  for (let i = min; i <= max; i += 1) {
    let diff = 0;

    for (let j = 0; j < input.length; j += 1)
      for (let k = Math.abs(i - input[j]!); k >= 1; k -= 1) diff += k;

    if (diff < answer) answer = diff;
  }

  return answer;
};

const solveC = (input: number[]): number => {
  const { min, max } = minMax(input);
  const d = max - min;
  const factorials = new Array(d).fill(0);

  for (let i = 0, acc = 0; i <= d; i += 1, acc += i) factorials[i] += acc;

  let answer = Number.MAX_SAFE_INTEGER;

  for (let i = min; i <= max; i += 1) {
    let diff = 0;

    for (let j = 0; j < input.length; j += 1)
      diff += factorials[Math.abs(i - input[j]!)];

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

  const startC = performance.now();
  const solutionC = solveC(positions);
  const endC = performance.now();

  console.log(`C: (${endC - startC}ms) ${solutionC}`);
})();
