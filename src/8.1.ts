// see also: ./full/8.1.full.ts
import { readFile } from 'fs/promises';

(async (): Promise<void> => {
  const input = await readFile('./input/8', 'utf-8');

  console.log(
    input.split('\n').reduce(
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
