export const nFactorials = (n: number): number[] => {
  const array = new Array(n).fill(0);

  for (let i = 0, acc = 0; i <= n; i += 1, acc += i) array[i] += acc;

  return array;
};
