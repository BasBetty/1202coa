// see also: ./full/10.1.full.ts
import { readLines } from './readLines';

(async (): Promise<void> => {
  const input = await readLines('./input/10');

  console.log(
    input.reduce((score: number, line: string): number => {
      const open = [];

      for (let i = 0; i < line.length; i += 1) {
        const char = line[i]!;

        if ('([{<'.includes(char)) {
          open.push(char);
        } else {
          const expected = { '(': ')', '[': ']', '{': '}', '<': '>' }[
            open[open.length - 1]!
          ];

          if (char === expected) {
            open.pop();
          } else {
            return score + { ')': 3, ']': 57, '}': 1197, '>': 25137 }[char]!;
          }
        }
      }

      return score;
    }, 0)
  );
})();
