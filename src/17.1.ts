((): void => {
  const xMin = 138;
  const xMax = 184;
  const yMin = -71;
  const yMax = -125;

  const hitMaxHeight = (xVel: number, yVel: number): number => {
    let x = 0;
    let y = 0;
    let highest = Number.NEGATIVE_INFINITY;

    while (true) {
      x += xVel;
      y += yVel;
      if (xVel > 0) xVel -= 1;
      if (xVel < 0) xVel += 1;
      yVel -= 1;

      if (y > highest) highest = y;
      if (yVel < 0 && (x > xMax || y < yMax)) return Number.NEGATIVE_INFINITY;
      if (x > xMin && y < yMin) return highest;
    }
  };

  let maxTotal = 0;

  for (let xVel = 1; xVel <= xMax; xVel += 1)
    for (let yVel = yMax; yVel <= -yMax; yVel += 1)
      maxTotal = Math.max(maxTotal, hitMaxHeight(xVel, yVel));

  console.log(maxTotal);
})();
