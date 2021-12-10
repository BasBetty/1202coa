import { readFile } from 'fs/promises';

const solve = (input: string): number => {
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

(async (): Promise<void> => {
  console.log(solve(await readFile('./input/10', 'utf-8')));
})();
