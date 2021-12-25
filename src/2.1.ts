// see also: ./full/2.1.full.ts
import { read10 } from './read10';
import { readLines } from './readLines';

interface V3 {
  x: number;
  y: number;
  z: number;
}

(async (): Promise<void> => {
  const lines = await readLines('./input/2');

  const { x, z } = lines.reduce(
    ({ x, y, z }: V3, line: string): V3 => {
      const [, direction, rawValue] = /(forward|down|up) (\d+)/.exec(line)!;
      const value = read10(rawValue!);

      if (direction === 'forward') return { x: x + value, y, z };
      return { x, y, z: z + direction! === 'down' ? value : -value };
    },
    { x: 0, y: 0, z: 0 }
  );

  console.log(x * z);
})();
