export const transposeMatrix = <T>(rows: T[][]): T[][] => {
  const columns: T[][] = new Array(rows.length);

  for (let i = 0; i < rows.length; i += 1) columns[i] = [];

  for (let i = 0; i < rows.length; i += 1)
    for (let j = 0; j < rows.length; j += 1) columns[j]![i] = rows[i]![j]!;

  return columns;
};
