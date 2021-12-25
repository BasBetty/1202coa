import { readFile } from 'fs/promises';

export type Location = '.' | '>' | 'v';
export type Row = Location[];
export type MoveX = [number, number];
export type MoveY = [number, number, number];
export type Floor = Row[];

const mvRow = (row: Row): [Row, number] => {
  const w = row.length;
  const moves: MoveX[] = [];

  row.forEach((l: Location, x: number): void => {
    if (l === '>') {
      const dest = (x + 1) % w;

      if (row[dest] === '.') moves.push([x, dest]);
    }
  });

  moves.forEach(([a, b]: [number, number]): void => {
    row[a] = '.';
    row[b] = '>';
  });

  return [row, moves.length];
};

const mvEast = (floor: Floor): [Floor, number] => {
  let moves = 0;

  floor.forEach((row: Row, y: number): void => {
    const [row_, moves_] = mvRow(row);

    floor[y] = row_;
    moves += moves_;
  });

  return [floor, moves];
};

const mvSouth = (floor: Floor): [Floor, number] => {
  const h = floor.length;
  const moves: MoveY[] = [];

  floor.forEach((row: Row, y: number): void => {
    row.forEach((l: Location, x: number): void => {
      if (l === 'v') {
        const dest = (y + 1) % h;

        if (floor[dest]![x] === '.') moves.push([x, y, dest]);
      }
    });
  });

  moves.forEach(([x, a, b]: MoveY): void => {
    floor[a]![x] = '.';
    floor[b]![x] = 'v';
  });

  return [floor, moves.length];
};

const mv = (floor: Floor): [Floor, boolean] => {
  const [floor1, moves1] = mvEast(floor);
  const [floor2, moves2] = mvSouth(floor1);

  return [floor2, moves1 + moves2 === 0];
};

export const solveNaive = (init: Floor): number => {
  const [floor0, done0] = mv(init);
  let floor = floor0;
  let steps = 1;
  let done = done0;

  while (!done) {
    const [floor1, done1] = mv(floor);
    done = done1;
    floor = floor1;
    steps += 1;
  }

  return steps;
};

export const readFloor = (string: string): Floor =>
  string
    .trim()
    .split('\n')
    .map((row: string): Location[] => row.split('') as Location[]);

export const showFloor = (floor: Floor): string =>
  floor.map((row: Location[]): string => row.join('')).join('\n');

(async (): Promise<void> => {
  const input = await readFile('./input/25', 'utf-8');
  console.log(solveNaive(readFloor(input)));
})();
