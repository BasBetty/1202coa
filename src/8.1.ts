import { readFile } from 'fs/promises';

const solve = (input: string): number => {
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

(async (): Promise<void> => {
  console.log(solve(await readFile('./input/8', 'utf-8')));
})();
