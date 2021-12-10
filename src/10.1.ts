import { readFile } from 'fs/promises';

const solve = (input: string): number => {
  const lines = input
    .trim()
    .split('\n')
    .map((line: string): string[] => [...line]);

  return lines.reduce((score: number, line: string[]): number => {
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
  }, 0);
};

(async (): Promise<void> => {
  console.log(solve(await readFile('./input/10', 'utf-8')));
})();
