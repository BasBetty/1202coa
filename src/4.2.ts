import { Maybe, Nothing } from './Maybe';
import { read10 } from './readInt';
import { readLines } from './readLines';
import { sum } from './sum';

const transposeM = <T>(rows: T[][]): T[][] => {
  const columns: T[][] = new Array(rows.length);

  for (let i = 0; i < rows.length; i += 1) columns[i] = [];

  for (let i = 0; i < rows.length; i += 1)
    for (let j = 0; j < rows.length; j += 1) columns[j]![i] = rows[i]![j]!;

  return columns;
};

const solveA = (input: string[]): Maybe<number> => {
  const marked = input[0]?.split(',').map(read10);
  const boards: Set<number>[][] = [];
  let rows: number[][] = [];

  for (let i = 2; i < input.length; i += 1) {
    if (i % 6 === 1) {
      boards.push([
        ...rows.map((row: number[]): Set<number> => new Set(row)),
        ...transposeM(rows).map((row: number[]): Set<number> => new Set(row)),
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

              for (let l = 0; l < boards[j]!.length / 2; l += 1)
                x += sum([...boards[j]![l]!]);

              return { just: x * marked![i]! };
            }

            winners.add(j);
          }
        }
      }
    }
  }

  return;
};

(async (): Promise<void> => {
  const input = await readLines('./input/4');

  const startA = performance.now();
  const solutionA = solveA(input);
  const endA = performance.now();

  if (solutionA === Nothing) throw new Error('wtf');

  console.log(`A: (${endA - startA}ms) ${solutionA}`);
})();
