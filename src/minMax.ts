export const minMax = (input: number[]): { min: number; max: number } => {
  let min = Number.MAX_SAFE_INTEGER;
  let max = -Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < input.length; i += 1) {
    const x = input[i]!;

    if (x > max) {
      max = x;
    } else if (x < min) {
      min = x;
    }
  }

  return { min, max };
};
