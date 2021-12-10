import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

export const sum = (arr: number[]): number => arr.reduce((prev, cur) => prev + cur, 0);
export const multiply = (arr: number[]): number => arr.reduce((prev, cur) => prev * cur, 1);

interface Env {
  token: string;
}
const getEnv = (): Env => {
  const envFile = fs.readFileSync(path.join(__dirname, '../.env')).toString();
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=').map(s => s.trim());
    (env as Env)[key as keyof Env] = value;
  });
  return env as Env;
};
const getToken = (): string => {
  return getEnv().token;
};

export async function readInput (day: number, year: number = 2021) {
  const cachedPath = path.join(__dirname, `/inputs/${year}-${day}`);
  if (fs.existsSync(cachedPath)) {
    console.log('Getting input from cache...');
    return fs.readFileSync(cachedPath).toString();
  }
  const response = await axios.get(`https://adventofcode.com/${year}/day/${day.toString()}/input`, {
    withCredentials: true,
    headers: {
      Cookie: `session=${getToken()}`
    },
    responseType: 'text'
  });
  const inputData: string = response.data.trim();
  fs.writeFileSync(cachedPath, inputData);
  return inputData;
}

export function difference (setA: Set<any>, setB: Set<any>) {
  const _difference = new Set(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

export const getAdjacentElements = (arr: any[], index: number): any[] => {
  const adjacent = [];
  if (index - 1 >= 0) {
    adjacent.push(arr[index - 1]);
  }
  if (index + 1 < arr.length) {
    adjacent.push(arr[index + 1]);
  }
  return adjacent;
};

export const getIndices = <T>(array: T[], element: T) => {
  const indices = [];
  let idx = array.indexOf(element);
  while (idx !== -1) {
    indices.push(idx);
    idx = array.indexOf(element, idx + 1);
  }
  return indices;
};

export const filterDistinct = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};
