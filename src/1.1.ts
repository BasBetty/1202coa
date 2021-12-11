// see also: ./full/1.1.full.ts
import { read10 } from './read10';
import { readLines } from './readLines';

(async (): Promise<void> => {
  const input = await readLines('./input/1');
  let increases = 0;
  let depth = read10(input[0]!);

  for (let i = 1; i < input.length; i += 1) {
    const nextDepth = parseInt(input[i]!, 10);

    if (nextDepth > depth) increases += 1;

    depth = nextDepth;
  }

  console.log(increases);
})();
