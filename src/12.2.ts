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

  const follow = (
    cave: string,
    once: Set<string>,
    twice: boolean,
    path: string[]
  ): void => {
    if (cave === 'end') {
      paths.add(path.join(' '));
      return;
    }

    const seen = once.has(cave);

    if ((path.length !== 0 && cave === 'start') || (twice && seen)) return;
    if (seen) twice = true;

    const newOnce = new Set(once);

    if (cave.toLowerCase() === cave) newOnce.add(cave);

    map
      .get(cave)!
      .forEach((next: string): void =>
        follow(next, newOnce, twice, [...path, cave])
      );
  };

  follow('start', new Set(), false, []);

  console.log(paths.size);
})();
