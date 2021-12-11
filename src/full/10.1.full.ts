import { readLines } from '../readLines';

const solveA = (input: string[]): number =>
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
  }, 0);

const solveB = (input: string[]): number => {
  const pairs: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
  };

  const scores: Record<string, number> = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  };

  const openers = '([{<';
  let score = 0;

  input.forEach((line: string): void => {
    const open = [];

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i]!;

      if (openers.includes(char)) {
        open.push(char);
      } else {
        const expected = pairs[open[open.length - 1]!];

        if (char === expected) {
          open.pop();
        } else {
          score += scores[char]!;
          return;
        }
      }
    }
  });

  return score;
};

(async (): Promise<void> => {
  const input = await readLines('./input/10');

  const start = performance.now();
  const solution = solveA(input);
  const end = performance.now();

  console.log(`A: (${end - start}ms) ${solution}`);

  const startB = performance.now();
  const solutionB = solveB(input);
  const endB = performance.now();

  console.log(`B: (${endB - startB}ms) ${solutionB}`);
})();
