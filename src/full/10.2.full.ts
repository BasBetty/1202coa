import { readFile } from 'fs/promises';

const solveA = (input: string): number => {
  const lines = input
    .trim()
    .split('\n')
    .map((line: string): string[] => [...line]);

  const scores = lines.reduce((scores: number[], line: string[]): number[] => {
    const open = [];

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i]!;

      if ('([{<'.includes(char)) {
        open.push(char);
      } else {
        const expected = { '(': ')', '[': ']', '{': '}', '<': '>' }[
          open[open.length - 1]!
        ];

        if (char !== expected) return scores;

        open.pop();
      }
    }

    scores.push(
      open
        .reverse()
        .reduce(
          (x: number, char: string): number => x * 5 + '([{<'.indexOf(char) + 1,
          0
        )
    );

    return scores;
  }, []);

  return scores.sort((a: number, b: number): number => a - b)[
    Math.round(scores.length / 2 - 1)
  ]!;
};

const solveB = (input: string): number => {
  const pairs: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
  };

  const openers = '([{<';
  const lines = input.trim().split('\n');
  const scores: number[] = [];

  lines.forEach((line: string): void => {
    const open = [];
    const n = line.length;
    let score = 0;

    for (let j = 0; j < n; j += 1) {
      const char = line[j]!;

      if ('([{<'.includes(char)) {
        open.push(char);
      } else {
        const expected = pairs[open[open.length - 1]!];

        if (char !== expected) return;

        open.pop();
      }
    }

    const m = open.length - 1;

    for (let j = m; j >= 0; j -= 1)
      score = score * 5 + openers.indexOf(open[j]!) + 1;

    scores.push(score);
  });

  return scores.sort((a: number, b: number): number => a - b)[
    Math.round(scores.length / 2 - 1)
  ]!;
};

(async (): Promise<void> => {
  const input = await readFile('./input/10', 'utf-8');

  const startA = performance.now();
  const solutionA = solveA(input);
  const endA = performance.now();

  console.log(`(${endA - startA}ms) ${solutionA}`);

  const startB = performance.now();
  const solutionB = solveB(input);
  const endB = performance.now();

  console.log(`(${endB - startB}ms) ${solutionB}`);
})();
