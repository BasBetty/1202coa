import { readFile } from 'fs/promises';

import { read10 } from './read10';

const sheetSize = (
  sheet: Map<number, Set<number>>
): { width: number; height: number } => {
  let width = 0;
  let height = 0;

  for (const [x, ys] of sheet) {
    if (x > width) width = x;

    for (const y of ys) if (y > height) height = y;
  }

  return { width: width + 1, height: height + 1 };
};

(async (): Promise<void> => {
  const input = await readFile('./input/13a', 'utf-8');
  const [posBlock, foldBlock] = input.trim().split('\n\n');
  let sheet = new Map<number, Set<number>>();
  let folded = new Map<number, Set<number>>();

  posBlock!.split('\n').forEach((line: string): void => {
    const [xRaw, yRaw] = line.split(',');
    const x = read10(xRaw!);
    const y = read10(yRaw!);
    sheet.set(x, (sheet.get(x) ?? new Set()).add(y));
  });

  foldBlock!.split('\n').forEach((line: string): void => {
    const [, axis, valueRaw] = /fold along (x|y)=(\d+)/.exec(line)!;
    const fold = read10(valueRaw!);
    const { width, height } = sheetSize(sheet);

    for (const [x, ys] of sheet) {
      for (const y of ys) {
        if (axis === 'x' && x > fold) {
          const newX = width - 1 - x;
          folded.set(newX, (folded.get(newX) ?? new Set()).add(y));
        } else if (axis === 'y' && y > fold) {
          folded.set(x, (folded.get(x) ?? new Set()).add(height - 1 - y));
        } else {
          folded.set(x, (folded.get(x) ?? new Set()).add(y));
        }
      }
    }

    sheet = folded;
    folded = new Map();
  });

  let n = 0;

  for (const [, ys] of sheet) n += ys.size;

  console.log(n);
})();
