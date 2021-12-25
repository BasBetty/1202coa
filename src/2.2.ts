// see also: ./full/2.2.full.ts
import { read10 } from './read10';
import { readLines } from './readLines';

interface V3 {
  x: number;
  y: number;
  z: number;
}

interface Acc {
  aim: number;
  pos: V3;
}

(async (): Promise<void> => {
  const lines = await readLines('./input/2');

  const {
    pos: { x, z },
  } = lines.reduce(
    ({ aim, pos: { x, y, z } }: Acc, line: string): Acc => {
      const [, dir, rawValue] = /(forward|down|up) (\d+)/.exec(line)!;
      const value = read10(rawValue!);

      if (dir === 'forward')
        return { aim, pos: { x: x + value, y, z: z + value * aim } };

      return {
        aim: aim + dir! === 'down' ? value : -value,
        pos: { x, y, z },
      };
    },
    { aim: 0, pos: { x: 0, y: 0, z: 0 } }
  );

  console.log(x * z);
})();
