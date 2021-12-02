import { readFile } from 'fs/promises';

interface V3 {
  x: number;
  y: number;
  z: number;
}

const solveA = (input: string): number => {
  const { x, z } = input
    .trim()
    .split('\n')
    .reduce(
      ({ x, y, z }: V3, rawInstruction: string): V3 => {
        const [, direction, rawValue] = /(\w+) (\d+)/.exec(rawInstruction)!;
        const value = parseInt(rawValue!, 10);

        if (direction === 'forward') return { x: x + value, y, z };
        if (direction === 'down') return { x, y, z: z + value };
        if (direction === 'up') return { x, y, z: z - value };

        throw new RangeError(`unknown direction: ${direction}`);
      },
      { x: 0, y: 0, z: 0 }
    );

  return x * z;
};

(async (): Promise<void> => {
  const input = await readFile('./input/2', { encoding: 'utf-8' });

  const startA = performance.now();
  const solutionA = solveA(input);
  const endA = performance.now();

  console.log(`A: (${endA - startA}ms) ${solutionA}`);
})();
