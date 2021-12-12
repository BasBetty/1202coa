import { readLines } from './readLines';

(async (): Promise<void> => {
  const input = await readLines('./input/12');
  const map = new Map<string, Set<string>>();

  input.forEach((line: string): void => {
    const [x, y] = line.split('-');

    map.set(x!, (map.get(x!) ?? new Set()).add(y!));
    map.set(y!, (map.get(y!) ?? new Set()).add(x!));
  });

  const paths = new Set();

  const follow = (cave: string, once: Set<string>, path: string[]): void => {
    if (cave === 'end') {
      paths.add(path.join(' '));
      return;
    }

    const isLower = cave === cave.toLowerCase();

    if (once.has(cave) && isLower) return;

    const newOnce = new Set(once).add(cave);

    if (isLower) newOnce.add(cave);

    map
      .get(cave)!
      .forEach((next: string): void => follow(next, newOnce, [...path, cave]));
  };

  follow('start', new Set(), []);

  console.log(paths.size);
})();
