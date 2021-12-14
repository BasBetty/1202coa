export const incrementMap = <K>(map: Map<K, number>, k: K, x: number): void => {
  map.set(k, (map.get(k) ?? 0) + x);
};
