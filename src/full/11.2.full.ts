import { read10 } from '../read10';
import { readLines } from '../readLines';

const solve = (input: string[]): number => {
  const levels = input.map((line: string): number[] => [...line].map(read10));
  const nX = levels[0]!.length;
  const nY = levels.length;
  const maxX = nX - 1;
  const maxY = nY - 1;

  const increase = (x: number, y: number): void => {
    const level = levels[y]![x]!;

    if (![0, 10].includes(level)) levels[y]![x]! += 1;
  };

  for (let i = 0; ; i += 1) {
    for (let x = 0; x < nX; x += 1)
      for (let y = 0; y < nY; y += 1) levels[y]![x]! += 1;

    let flashes: number | null = null;

    while (flashes === null || flashes > 0) {
      flashes = 0;

      for (let x = 0; x < nX; x += 1) {
        for (let y = 0; y < nY; y += 1) {
          if (levels[y]![x]! === 10) {
            flashes += 1;

            const left = x - 1;
            const right = x + 1;
            const up = y - 1;
            const down = y + 1;
            const hasLeft = x > 0;
            const hasRight = x < maxX;
            const hasUp = y > 0;
            const hasDown = y < maxY;

            levels[y]![x]! = 0;

            if (hasLeft) {
              increase(left, y);
              if (hasUp) increase(left, up);
              if (hasDown) increase(left, down);
            }

            if (hasRight) {
              increase(right, y);
              if (hasUp) increase(right, up);
              if (hasDown) increase(right, down);
            }

            if (hasUp) increase(x, up);
            if (hasDown) increase(x, down);
          }
        }
      }
    }

    if (new Set(levels.flat()).size === 1) return i + 1;
  }
};

(async (): Promise<void> => {
  const input = await readLines('./input/11');

  const start = performance.now();
  const solution = solve(input);
  const end = performance.now();

  console.log(`(${end - start}ms) ${solution}`);
})();
