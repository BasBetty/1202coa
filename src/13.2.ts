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
  const input = await readFile('./input/13', 'utf-8');
  const [posBlock, foldBlock] = input.trim().split('\n\n');
  let sheet = new Map<number, Set<number>>();

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
    const folded = new Map();

    for (const [x, ys] of sheet) {
      for (const y of ys) {
        const newX = axis === 'x' && x > fold ? width - 1 - x : x;
        const newY = axis === 'y' && y > fold ? height - 1 - y : y;
        folded.set(newX, (folded.get(newX) ?? new Set()).add(newY));
      }
    }

    sheet = folded;
  });

  const { width, height } = sheetSize(sheet);

  const scanlines: string[][] = Array.from(
    { length: height },
    (_, y: number): string[] => new Array(width).fill(' ')
  );

  for (const [x, ys] of sheet) for (const y of ys) scanlines[y]![x] = '█';
  for (const line of scanlines) console.log(line.join(''));
})();
