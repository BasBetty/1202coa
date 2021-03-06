/*

 aaaa            aaaa    aaaa           aaaa    aaaa    aaaa    aaaa    aaaa 
b    c       c       c       c  b    c b       b            c  b    c  b    c
b    c       c       c       c  b    c b       b            c  b    c  b    c
                 dddd    dddd    dddd   dddd    dddd            dddd    dddd
e    f       f  e            f       f      f  e    f       f  e    f       f
e    f       f  e            f       f      f  e    f       f  e    f       f
 gggg            gggg    gggg           gggg    gggg            gggg    gggg

a 8
b 6
c 8
d 7
e 4
f 9
g 7

4 -> segment e
6 -> segment b
7 -> segment d or g
8 -> segment a or c
9 -> segment f

*/

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

const solveA = (input: string): number => {
  const entries = input.split('\n');
  const count: SegmentMap<number> = {};

  let sum = 0;

  for (let i = 0; i < entries.length; i += 1) {
    for (let j = 0; j < 7; j += 1) count['abcdefg'[j] as Segment] = 0;

    const [rawPatterns, rawOutputs] = entries[i]!.split(' | ');
    const patterns = rawPatterns!.split(' ');
    const outputs = rawOutputs!.split(' ');
    const segments: SegmentMap<Segment> = {};

    let one: string;
    let four: string;

    for (let j = 0; j < patterns.length; j += 1) {
      const pattern = patterns[j]!;

      if (pattern.length === 2) {
        one = pattern;
      } else if (pattern.length === 4) {
        four = pattern;
      }

      for (let k = 0; k < pattern.length; k += 1)
        count[pattern[k] as Segment] = (count[pattern[k] as Segment] ?? 0) + 1;
    }

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

    for (let j = 0; j < outputs.length; j += 1) {
      const s = [];

      for (let k = 0; k < outputs[j]!.length; k += 1)
        s.push(segments[outputs[j]![k] as Segment]!);

      sum +=
        parseInt(digits.get(s.sort().join(''))!, 10) *
        10 ** (outputs.length - j - 1);
    }
  }

  return sum;
};

const solveB = (input: string): number => {
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

  return sum;
};

(async (): Promise<void> => {
  const input = await readFile('./input/8', 'utf-8');

  const startA = performance.now();
  const solutionA = solveA(input);
  const endA = performance.now();

  console.log(`A: (${endA - startA}ms) ${solutionA}`);

  const startB = performance.now();
  const solutionB = solveB(input);
  const endB = performance.now();

  console.log(`B: (${endB - startB}ms) ${solutionB}`);
})();
