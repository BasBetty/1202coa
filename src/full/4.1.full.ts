import { readFile } from 'fs/promises';

const solve = (input: string): number => {
  const boards: Set<number>[][] = [];
  const groups = input.split(/\s+/g);
  const numbers = new Uint8Array(groups[0]!.split(',').map(Number));
  const c = groups.slice(1).map(Number);

  for (let i = 0; i < c.length; i += 25) {
    boards.push([
      new Set(c.slice(i, i + 5)),
      new Set(c.slice(i + 5, i + 10)),
      new Set(c.slice(i + 10, i + 15)),
      new Set(c.slice(i + 15, i + 20)),
      new Set(c.slice(i + 20, i + 25)),
      new Set([c[i + 0]!, c[i + 5]!, c[i + 10]!, c[i + 15]!, c[i + 20]!]),
      new Set([c[i + 1]!, c[i + 6]!, c[i + 11]!, c[i + 16]!, c[i + 21]!]),
      new Set([c[i + 2]!, c[i + 7]!, c[i + 12]!, c[i + 17]!, c[i + 22]!]),
      new Set([c[i + 3]!, c[i + 8]!, c[i + 13]!, c[i + 18]!, c[i + 23]!]),
      new Set([c[i + 4]!, c[i + 9]!, c[i + 14]!, c[i + 19]!, c[i + 24]!]),
    ]);
  }

  const N = numbers.length;
  const M = boards.length;

  for (let i = 0; i < N; i += 1) {
    for (let j = 0; j < M; j += 1) {
      for (let k = 0; k < 10; k += 1) {
        const board = boards[j]!;
        const line = board[k]!;
        const number = numbers[i]!;
        line.delete(number);

        if (line.size === 0) {
          let score = 0;

          for (let x = 0; x < 5; x += 1) {
            board[x]!.forEach((y: number): void => {
              score += y;
            });
          }

          return score * number;
        }
      }
    }
  }

  throw new Error('solution not found');
};

(async (): Promise<void> => {
  const input = await readFile('./input/4', 'utf-8');

  const start = performance.now();
  const solution = solve(input);
  const end = performance.now();

  console.log(`(${end - start}ms) ${solution}`);
})();
