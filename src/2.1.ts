// see also: ./full/2.1.full.ts
import { read10 } from './read10';
import { readLines } from './readLines';

interface V3 {
  x: number;
  y: number;
  z: number;
}

(async (): Promise<void> => {
  const input = await readLines('./input/2');

  const { x, z } = input.reduce(
    ({ x, y, z }: V3, rawInstruction: string): V3 => {
      const [, direction, rawValue] = /(\w+) (\d+)/.exec(rawInstruction)!;
      const value = read10(rawValue!);

      if (direction === 'forward') return { x: x + value, y, z };
      if (direction === 'down') return { x, y, z: z + value };
      if (direction === 'up') return { x, y, z: z - value };

      throw new RangeError(`unknown direction: ${direction}`);
    },
    { x: 0, y: 0, z: 0 }
  );

  console.log(x * z);
})();
