const hitMaxHeight = (
  xVel: number,
  yVel: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number
): number | null => {
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
    if (yVel < 0 && (x > xMax || y < yMax)) return null;
    if (x > xMin && y < yMin) return highest;
  }
};

(async (): Promise<void> => {
  const xMin = 138;
  const xMax = 184;
  const yMin = -71;
  const yMax = -125;
  let maxTotal = 0;

  for (let xVel = 1; xVel < xMax; xVel += 1) {
    for (let yVel = 1; yVel < yMax; yVel += 1) {
      const max = hitMaxHeight(xVel, yVel, xMin, xMax, yMin, yMax);

      if (max !== null && max > maxTotal) maxTotal = max;
    }
  }

  console.log(maxTotal);
})();
