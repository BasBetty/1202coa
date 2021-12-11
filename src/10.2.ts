// see also: ./full/10.2.full.ts
import { readLines } from './readLines';

(async (): Promise<void> => {
  const input = await readLines('./input/10');

  const scores = input.reduce((scores: number[], line: string): number[] => {
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

  console.log(
    scores.sort((a: number, b: number): number => a - b)[
      Math.round(scores.length / 2 - 1)
    ]!
  );
})();
