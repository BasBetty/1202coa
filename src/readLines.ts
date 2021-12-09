import { readFile } from 'fs/promises';

export const readLines = async (path: string): Promise<string[]> => {
  const file = await readFile(path, 'utf-8');

  return file.trim().split('\n');
};
