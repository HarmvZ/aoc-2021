import * as diagnostics from './inputs/day3.json';
// const diagnostics: string[] = [
//   '00100',
//   '11110',
//   '10110',
//   '10111',
//   '10101',
//   '01111',
//   '00111',
//   '11100',
//   '10000',
//   '11001',
//   '00010',
//   '01010'
// ];

const diagnosticElementLength = diagnostics[0].length;
const sums: number[] = new Array(diagnosticElementLength).fill(0);
for (const d of diagnostics) {
  for (const [index, c] of d.split('').entries()) {
    sums[index] += parseInt(c);
  }
}
const mostCommonBit = sums.map(sum => (sum > (diagnostics.length / 2)) ? '1' : '0').join('');
const leastCommonBit = mostCommonBit.split('').map(c => c === '1' ? '0' : '1').join('');
const result1 = parseInt(mostCommonBit, 2) * parseInt(leastCommonBit, 2);
console.log('3.1:', result1);// 1307354

// day3.2
let most = diagnostics.slice();
let least = diagnostics.slice();
let i = 0;
while (most.length > 1 && i < diagnosticElementLength) {
  const bitSum = most.reduce((prev, cur) => prev + parseInt(cur[i]), 0);
  const curMostCommon: string = (bitSum >= (most.length / 2)) ? '1' : '0';
  most = most.filter(d => d[i] === curMostCommon);
  i += 1;
}
i = 0;
while (least.length > 1 && i < diagnosticElementLength) {
  const bitSum = least.reduce((prev, cur) => prev + parseInt(cur[i]), 0);
  const curLeastCommon: string = (bitSum < (least.length / 2)) ? '1' : '0';
  least = least.filter(d => d[i] === curLeastCommon);
  i += 1;
}
const result2: number = parseInt(most[0], 2) * parseInt(least[0], 2);
console.log('3.2:', result2);// 482500
