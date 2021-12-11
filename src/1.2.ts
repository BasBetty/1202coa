// see also: ./full/1.2.full.ts
import { read10 } from './read10';
import { readLines } from './readLines';

(async (): Promise<void> => {
  const input = await readLines('./input/1');
  const depths = input.map(read10);
  let increases = 0;

  for (let i = 0; i < depths.length; i += 1)
    if (depths[i]! < depths[i + 3]!) increases += 1;

  console.log(increases);
})();
