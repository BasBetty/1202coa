// see also: ./full/3.2.full.ts
import { readLines } from './readLines';

const column = (input: string[], j: number): number => {
  let column = 0;

  for (let i = 0; i < input.length; i += 1)
    if (input[i]![j]! === '1') column += 1;

  return column;
};

(async (): Promise<void> => {
  const input = await readLines('./input/3');
  const m = input[0]!.length;
  let o2s = input;
  let co2s = input;

  for (let i = 0; i < m; i += 1) {
    const mc = column(o2s, i) >= o2s.length / 2 ? '1' : '0';
    const lc = column(co2s, i) >= co2s.length / 2 ? '0' : '1';

    if (o2s.length !== 1)
      o2s = o2s.filter((line: string): boolean => line[i] === mc);

    if (co2s.length !== 1)
      co2s = co2s.filter((line: string): boolean => line[i] === lc);
  }

  let o2 = 0;
  let co2 = 0;

  for (let i = 0; i < m; i += 1) {
    const x = 2 ** (m - 1 - i);

    if (o2s[0]![i] === '1') o2 += x;
    if (co2s[0]![i] === '1') co2 += x;
  }

  console.log(o2 * co2);
})();
