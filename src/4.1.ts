import { read10 } from './readInt';
import { readLines } from './readLines';
import { transposeMatrix } from './transposeMatrix';

const solveA = (input: string[]): number => {
  const marked = input[0]?.split(',').map(read10);
  const boards: Set<number>[][] = [];
  let rows: number[][] = [];

  for (let i = 2; i < input.length; i += 1) {
    if (i % 6 === 1) {
      boards.push([
        ...rows.map((row: number[]): Set<number> => new Set(row)),
        ...transposeMatrix(rows).map(
          (row: number[]): Set<number> => new Set(row)
        ),
      ]);

      rows = [];
    } else {
      rows.push(input[i]!.trim().split(/\s+/).map(read10));
    }
  }

  for (let i = 0; i < marked!.length; i += 1) {
    for (let j = 0; j < boards.length; j += 1) {
      for (let k = 0; k < boards[j]!.length; k += 1) {
        boards[j]![k]!.delete(marked![i]!);

        if (boards[j]![k]!.size === 0) {
          let x = 0;

          for (let l = 0; l < boards[j]!.length / 2; l += 1) {
            const board = [...boards[j]![l]!];

            for (let m = 0; m < board.length; m += 1) x += board[m]!;
          }

          return x * marked![i]!;
        }
      }
    }
  }

  throw new Error('solution not found');
};

(async (): Promise<void> => {
  const input = await readLines('./input/4');

  const startA = performance.now();
  const solutionA = solveA(input);
  const endA = performance.now();

  console.log(`A: (${endA - startA}ms) ${solutionA}`);
})();
