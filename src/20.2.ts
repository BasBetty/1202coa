import { readFile } from 'fs/promises';

const newImage = (size: number): number[][] =>
  Array.from({ length: size }, () => new Array(size).fill(0));

const toDecimal = (pxs: number[]): number =>
  parseInt(pxs.join('').replace(/#/g, '1').replace(/\./g, '0'), 2);

(async () => {
  const N = 50;
  const input = await readFile('./input/20', 'utf-8');
  const [rawAlgo, rawImage] = input.trim().split('\n\n');
  const image = rawImage!.split('\n');
  const size = image[0]!.length + 4 * N;
  let prev = newImage(size);

  const algo = rawAlgo!
    .split('')
    .map((c: string): number => (c === '#' ? 1 : 0));

  image.forEach((line: string, y: number): void => {
    for (let x = 0; x < line.length; x += 1)
      if (line[x] === '#') prev![y + 2 * N]![x + 2 * N] = 1;
  });

  for (let i = 0; i < N; i += 1) {
    const current = newImage(size);

    for (let y = 1; y < size - 1; y += 1) {
      for (let x = 1; x < size - 1; x += 1) {
        const index = toDecimal([
          prev[y - 1]![x - 1]!,
          prev[y - 1]![x]!,
          prev[y - 1]![x + 1]!,
          prev[y]![x - 1]!,
          prev[y]![x]!,
          prev[y]![x + 1]!,
          prev[y + 1]![x - 1]!,
          prev[y + 1]![x]!,
          prev[y + 1]![x + 1]!,
        ]);

        current[y]![x]! = algo[index]!;
      }
    }

    prev = current;
  }

  let lit = 0;

  for (let y = N; y < size - N; y += 1)
    for (let x = N; x < size - N; x += 1) if (prev[y]![x]) lit += 1;

  console.log(lit);
})();
