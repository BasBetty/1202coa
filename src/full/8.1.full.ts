import { readFile } from 'fs/promises';

const solveA = (input: string): number => {
  const entries = input.split('\n');
  let sum = 0;

  for (let i = 0; i < entries.length; i += 1) {
    const [, rawOutputs] = entries[i]!.split(' | ');
    const outputs = rawOutputs!.split(' ');

    for (let j = 0; j < outputs.length; j += 1)
      if ([2, 3, 4, 7].includes(outputs[j]!.length)) sum += 1;
  }

  return sum;
};

const solveB = (input: string): number =>
  input.split('\n').reduce(
    (sum: number, entry: string): number =>
      sum +
      entry
        .split(' | ')[1]!
        .split(' ')
        .filter((x: string): boolean => [2, 3, 4, 7].includes(x.length)).length,
    0
  );

(async (): Promise<void> => {
  const input = await readFile('./input/8', 'utf-8');

  const startA = performance.now();
  const solutionA = solveA(input);
  const endA = performance.now();

  console.log(`A: (${endA - startA}ms) ${solutionA}`);

  const startB = performance.now();
  const solutionB = solveB(input);
  const endB = performance.now();

  console.log(`B: (${endB - startB}ms) ${solutionB}`);
})();
