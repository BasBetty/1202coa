// see also: ./full/4.2.full.ts
import { read10 } from './read10';
import { readLines } from './readLines';
import { transposeMatrix } from './transposeMatrix';

(async (): Promise<void> => {
  const input = await readLines('./input/4');
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

  const winners = new Set();

  for (let i = 0; i < marked!.length; i += 1) {
    for (let j = 0; j < boards.length; j += 1) {
      for (let k = 0; k < boards[j]!.length; k += 1) {
        if (!winners.has(j)) {
          boards[j]![k]!.delete(marked![i]!);

          if (boards[j]![k]!.size === 0) {
            if (winners.size + 1 === boards.length) {
              let x = 0;

              for (let l = 0; l < boards[j]!.length / 2; l += 1) {
                const board = [...boards[j]![l]!];

                for (let m = 0; m < board.length; m += 1) x += board[m]!;
              }

              console.log(x * marked![i]!);
              return;
            }

            winners.add(j);
          }
        }
      }
    }
  }
})();
