/* eslint-disable no-labels */
import { readInput } from './../utils';

readInput(9, 2020).then((input: string) => {
//   input = `35
// 20
// 15
// 25
// 47
// 40
// 62
// 55
// 65
// 95
// 102
// 117
// 150
// 182
// 127
// 219
// 299
// 277
// 309
// 576`;

  const numbers: number[] = input.split('\n').map(i => parseInt(i));

  const range = 25;

  for (let i = range; i < numbers.length; i++) {
    const cur = numbers[i];
    outer: {
      for (let j = i - range; j < i; j++) {
        for (let k = i - range; k < i; k++) {
          if (numbers[j] + numbers[k] === cur && i !== j) {
            break outer;
          }
        }
      }
      console.log('9.1', cur);
      break;
    }
  }

  const requiredSum = 1038347917;

  type Range = {
    min: number;
    max: number;
  };
  const findSumRange = (nrs: number[], reqSum: number): Range => {
    const sumRange: Range = { min: 0, max: 1 };
    for (let i1 = 0; i1 < numbers.length; i1++) {
      sumRange.min = i1;

      for (let i2 = i1; i2 < numbers.length; i2++) {
        sumRange.max = i2;
        const sumResult = numbers.slice(sumRange.min, sumRange.max).reduce((prev, cur) => prev + cur, 0);
        if (sumResult === reqSum) {
          return sumRange;
        }
      }
      console.log('Checked all for', sumRange.min);
    }
    throw Error('No summing rangefound');
  };

  const resultRange = findSumRange(numbers, requiredSum);
  const numbersRange = numbers.slice(resultRange.min, resultRange.max);
  console.log('9.2', Math.min(...numbersRange) + Math.max(...numbersRange));
});
