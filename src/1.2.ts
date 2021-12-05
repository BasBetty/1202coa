import { read10 } from './readInt';
import { readLines } from './readLines';

const solveA = (input: string[]): number => {
  const windowSize = 3;

  let increases = 0;
  let window = input.slice(0, windowSize).reverse().map(read10);

  for (let i = windowSize; i < input.length; i += 1) {
    let depth = 0;
    let nextDepth = 0;

    for (let j = 0; j < windowSize; j += 1) depth += window[j]!;

    window.pop();
    window = [parseInt(input[i]!, 10), ...window];

    for (let j = 0; j < windowSize; j += 1) nextDepth += window[j]!;

    if (nextDepth > depth) increases += 1;

    depth = nextDepth;
  }

  return increases;
};

// no array necessary
const solveB = (input: string[]): number => {
  const depths = input.map(read10);

  let increases = 0;
  let depth = 0;

  for (let i = 0; i < depths.length; i += 1) {
    const nextDepth = depth - depths[i]! + depths[i + 3]!;

    if (nextDepth > depth) increases += 1;

    depth = nextDepth;
  }

  return increases;
};

// no state necessary
const solveC = (input: string[]): number => {
  const depths = input.map(read10);
  let increases = 0;

  for (let i = 0; i < depths.length; i += 1)
    if (depths[i]! < depths[i + 3]!) increases += 1;

  return increases;
};

(async (): Promise<void> => {
  const input = await readLines('./input/1');

  const startA = performance.now();
  const solutionA = solveA(input);
  const endA = performance.now();

  console.log(`A: (${endA - startA}ms) ${solutionA}`);

  const startB = performance.now();
  const solutionB = solveB(input);
  const endB = performance.now();

  console.log(`B: (${endB - startB}ms) ${solutionB}`);

  const startC = performance.now();
  const solutionC = solveC(input);
  const endC = performance.now();

  console.log(`C: (${endC - startC}ms) ${solutionC}`);
})();
