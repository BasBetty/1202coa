type Rolls = [number, number, number];

((): void => {
  const wins = new Map<string, [number, number]>();

  const solve = (
    pos1: number,
    pos2: number,
    score1: number,
    score2: number
  ): [number, number] => {
    if (score2 >= 21) return [0, 1];

    const key = `${pos1}.${pos2}.${score1}.${score2}`;

    if (wins.has(key)) return wins.get(key)!;

    const result: [number, number] = [0, 0];

    for (let a = 1; a <= 3; a += 1) {
      for (let b = 1; b <= 3; b += 1) {
        for (let c = 1; c <= 3; c += 1) {
          const pos3 = ((pos1 + a + b + c - 1) % 10) + 1;
          const wins = solve(pos2, pos3, score2, score1 + pos3);

          result[0] += wins[1];
          result[1] += wins[0];
        }
      }
    }

    wins.set(key, result);

    return result;
  };

  const [wins1, wins2] = solve(3, 4, 0, 0);

  console.log(Math.max(wins1, wins2));
})();
