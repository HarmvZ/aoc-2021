import * as measurements from './inputs/day1.json';

// day 1.1
const result1: number = measurements.map((measurement, index, arr) => index > 0 && measurement > arr[index - 1]).reduce((prev, cur) => prev + (cur ? 1 : 0), 0);
console.log('1.1:', result1);// 1692

// day 1.2
const sums3 : number[] = measurements.map((m2, index, arr) => index > 1 && m2 + arr[index - 1] + arr[index - 2]).slice(2);
const result2: number = sums3.map((measurement, index, arr) => index > 0 && measurement > arr[index - 1]).reduce((prev, cur) => prev + (cur ? 1 : 0), 0);
console.log('1.2:', result2);// 1724
