import { readFile } from 'fs/promises';

type Segment = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
type SegmentMap<T> = { [K in Segment]?: T };

const segmentsToDigit = new Map([
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
  let sum = 0;

  for (let i = 0; i < entries.length; i += 1) {
    const [rawPatterns, rawOutputs] = entries[i]!.split(' | ');
    const patterns = rawPatterns!.split(' ');
    const outputs = rawOutputs!.split(' ');
    const count: SegmentMap<number> = {};
    const segments: SegmentMap<Segment> = {};

    let one: string;
    let four: string;

    for (let j = 0; j < 7; j += 1) count['abcdefg'[j] as Segment] = 0;

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
        parseInt(segmentsToDigit.get(s.sort().join(''))!, 10) *
        10 ** (outputs.length - j - 1);
    }
  }

  return sum;
};

(async (): Promise<void> => {
  console.log(solveA(await readFile('./input/8', 'utf-8')));
})();
