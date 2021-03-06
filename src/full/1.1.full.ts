import { read10 } from '../read10';
import { readLines } from '../readLines';

interface Counter {
  increases: number;
  previousDepth: number;
}

const solveA = (input: string[]): number =>
  input.reduce(
    ({ increases, previousDepth }: Counter, rawDepth: string): Counter => {
      const depth = read10(rawDepth);

      return {
        increases: depth > previousDepth ? increases + 1 : increases,
        previousDepth: depth,
      };
    },
    { increases: -1, previousDepth: 0 }
  ).increases;

const solveB = (input: string[]): number => {
  let increases = 0;
  let depth = read10(input[0]!);

  for (let i = 1; i < input.length; i += 1) {
    const nextDepth = parseInt(input[i]!, 10);

    if (nextDepth > depth) increases += 1;

    depth = nextDepth;
  }

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

  console.log(`A: (${endB - startB}ms) ${solutionB}`);
})();
