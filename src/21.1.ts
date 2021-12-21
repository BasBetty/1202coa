((): void => {
  const roll = (die: number, rolls: number): [number, number, number] => {
    let result = 0;

    for (let i = 0; i < 3; i += 1) {
      result += die;
      die = die === 100 ? 1 : die + 1;
    }

    return [die, result, rolls + 3];
  };

  const solve = (): number => {
    let pos1 = 3;
    let pos2 = 4;
    let score1 = 0;
    let score2 = 0;
    let die = 1;
    let rolls = 0;

    while (true) {
      const [die1, move1, rolls1] = roll(die, rolls);
      [rolls, die] = [rolls1, die1];
      pos1 = ((pos1 + move1 - 1) % 10) + 1;
      score1 += pos1;
      if (score1 >= 1000) return score2 * rolls;

      const [die2, move2, rolls2] = roll(die, rolls);
      [rolls, die] = [rolls2, die2];
      pos2 = ((pos2 + move2 - 1) % 10) + 1;
      score2 += pos2;
      if (score2 >= 1000) return score1 * rolls;
    }
  };

  console.log(solve());
})();
