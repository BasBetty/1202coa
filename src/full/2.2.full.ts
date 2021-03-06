import { read10 } from '../read10';
import { readLines } from '../readLines';

interface V3 {
  x: number;
  y: number;
  z: number;
}

interface Acc {
  aim: number;
  position: V3;
}

const solve = (input: string[]): number => {
  const {
    position: { x, z },
  } = input.reduce(
    ({ aim, position: { x, y, z } }: Acc, rawInstruction: string): Acc => {
      const [, direction, rawValue] = /(\w+) (\d+)/.exec(rawInstruction)!;
      const value = read10(rawValue!);

      if (direction === 'forward')
        return { aim, position: { x: x + value, y, z: z + value * aim } };

      if (direction === 'down')
        return { aim: aim + value, position: { x, y, z } };

      if (direction === 'up')
        return { aim: aim - value, position: { x, y, z } };

      throw new RangeError(`unknown direction: ${direction}`);
    },
    { aim: 0, position: { x: 0, y: 0, z: 0 } }
  );

  return x * z;
};

(async (): Promise<void> => {
  const input = await readLines('./input/2');

  const start = performance.now();
  const solution = solve(input);
  const end = performance.now();

  console.log(`(${end - start}ms) ${solution}`);
})();
