import { readLines } from './readLines';

const solve = (input: string[]): number => {
  const n = input.length;
  const m = input[0]!.length;
  const n2 = n / 2;
  const columns = new Array(m).fill(0);

  for (let i = 0; i < n; i += 1)
    for (let j = 0; j < m; j += 1) if (input[i]![j]! === '1') columns[j] += 1;

  let gamma = 0;
  let epsilon = 0;

  for (let i = 0; i < m; i += 1) {
    const x = 2 ** (m - 1 - i);

    if (columns[i] > n2) {
      gamma += x;
    } else {
      epsilon += x;
    }
  }

  return gamma * epsilon;
};

(async (): Promise<void> => {
  const input = await readLines('./input/3');

  const start = performance.now();
  const solution = solve(input);
  const end = performance.now();

  console.log(`(${end - start}ms) ${solution}`);
})();
