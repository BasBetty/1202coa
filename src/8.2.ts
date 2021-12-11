// see also: ./full/8.2.full.ts
import { readFile } from 'fs/promises';

type Segment = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
type SegmentMap<T> = { [K in Segment]?: T };

const digits = new Map([
  ['abcefg', '0'],
  ['cf', '1'],
  ['acdeg', '2'],
  ['acdfg', '3'],
  ['bcdf', '4'],
  ['abdfg', '5'],
  ['abdefg', '6'],
  ['acf', '7'],
  ['abcdefg', '8'],
  ['abcdfg', '9'],
]);

(async (): Promise<void> => {
  const input = await readFile('./input/8', 'utf-8');
  const entries = input.split('\n');
  const count: SegmentMap<number> = {};
  let sum = 0;

  entries.forEach((entry: string): void => {
    [...'abcdefg'].forEach((x: string): void => {
      count[x as Segment] = 0;
    });

    const [rawPatterns, rawOutputs] = entry.split(' | ');
    const patterns = rawPatterns!.split(' ');
    const outputs = rawOutputs!.split(' ');
    const segments: SegmentMap<Segment> = {};

    let one: string;
    let four: string;

    patterns.forEach((pattern: string): void => {
      if (pattern.length === 2) {
        one = pattern;
      } else if (pattern.length === 4) {
        four = pattern;
      }

      [...pattern].forEach((segment: string): void => {
        count[segment as Segment] = (count[segment as Segment] ?? 0) + 1;
      });
    });

    for (const [segment, n] of Object.entries(count)) {
      if (n === 4) {
        segments[segment as Segment] = 'e';
      } else if (n === 6) {
        segments[segment as Segment] = 'b';
      } else if (n === 7) {
        segments[segment as Segment] = four!.includes(segment) ? 'd' : 'g';
      } else if (n === 8) {
        segments[segment as Segment] = one!.includes(segment) ? 'c' : 'a';
      } else if (n === 9) {
        segments[segment as Segment] = 'f';
      }
    }

    outputs.forEach((output: string, i: number): void => {
      const digit = [...output]
        .map((x: string): Segment => segments[x as Segment]!)
        .sort()
        .join('');

      sum += parseInt(digits.get(digit)!, 10) * 10 ** (outputs.length - i - 1);
    });
  });

  console.log(sum);
})();
