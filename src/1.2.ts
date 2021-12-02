import { readFile } from 'fs/promises';

const solveA = (input: string): number => {
  const windowSize = 3;
  const rawDepths = input.trim().split(/\s+/);

  let increases = 0;

  let window = rawDepths
    .slice(0, windowSize)
    .reverse()
    .map((rawDepth: string): number => parseInt(rawDepth, 10));

  for (let i = windowSize; i < rawDepths.length; i += 1) {
    let depth = 0;
    let nextDepth = 0;

    for (let j = 0; j < windowSize; j += 1) depth += window[j]!;

    window.pop();
    window = [parseInt(rawDepths[i]!, 10), ...window];

    for (let j = 0; j < windowSize; j += 1) nextDepth += window[j]!;

    if (nextDepth > depth) increases += 1;

    depth = nextDepth;
  }

  return increases;
};

// no array necessary
const solveB = (input: string): number => {
  const windowSize = 3;
  const depths = input
    .trim()
    .split(/\s+/)
    .map((rawDepth: string): number => parseInt(rawDepth, 10));

  let increases = 0;
  let depth = 0;

  for (let i = 0; i < depths.length; i += 1) {
    const nextDepth = depth - depths[i]! + depths[i + windowSize]!;

    if (nextDepth > depth) increases += 1;

    depth = nextDepth;
  }

  return increases;
};

(async (): Promise<void> => {
  const input = await readFile('./input/1', { encoding: 'utf-8' });

  const startA = performance.now();
  const solutionA = solveA(input);
  const endA = performance.now();

  console.log(`A: (${endA - startA}ms) ${solutionA}`);

  const startB = performance.now();
  const solutionB = solveB(input);
  const endB = performance.now();

  console.log(`B: (${endB - startB}ms) ${solutionB}`);
})();
