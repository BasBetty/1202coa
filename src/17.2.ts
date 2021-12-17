const isHit = (
  xVel: number,
  yVel: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number
): boolean => {
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

(async (): Promise<void> => {
  const xMin = 138;
  const xMax = 184;
  const yMin = -71;
  const yMax = -125;
  let n = 0;

  for (let xVel = 1; xVel <= xMax; xVel += 1)
    for (let yVel = yMax; yVel <= -yMax; yVel += 1)
      n += isHit(xVel, yVel, xMin, xMax, yMin, yMax) ? 1 : 0;

  console.log(n);
})();
