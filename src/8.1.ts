// see also: ./full/8.1.full.ts
import { readLines } from './readLines';

(async (): Promise<void> => {
  const input = await readLines('./input/8');

  console.log(
    input.reduce(
      (sum: number, entry: string): number =>
        sum +
        entry
          .split(' | ')[1]!
          .split(' ')
          .filter((x: string): boolean => [2, 3, 4, 7].includes(x.length))
          .length,
      0
    )
  );
})();
