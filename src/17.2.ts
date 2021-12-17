((): void => {
  const xMin = 138;
  const xMax = 184;
  const yMin = -71;
  const yMax = -125;

  const isHit = (xVel: number, yVel: number): boolean => {
    let x = 0;
    let y = 0;

    while (true) {
      x += xVel;
      y += yVel;
      if (xVel > 0) xVel -= 1;
      if (xVel < 0) xVel += 1;
      yVel -= 1;

      if (yVel < 0 && (x > xMax || y < yMax)) return false;
      if (x >= xMin && y <= yMin) return true;
    }
  };

  let n = 0;

  for (let xVel = 1; xVel <= xMax; xVel += 1)
    for (let yVel = yMax; yVel <= -yMax; yVel += 1)
      n += isHit(xVel, yVel) ? 1 : 0;

  console.log(n);
})();
