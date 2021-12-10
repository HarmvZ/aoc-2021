import { getIndices, readInput } from './../utils';

readInput(2, 2020).then(input => {
  //   input = `1-3 a: abcde
  // 1-3 b: cdefg
  // 2-9 c: ccccccccc`;// example input
  const passwords = input.split('\n').map(
    p => p.split(':').map(p => p.trim())
  );
  let valid = 0;
  let valid2 = 0;
  for (const [policy, password] of passwords) {
    const [nMin, nMax, char] = policy.split(/[- ]{1}/);
    const count = password.split(char).length - 1;
    valid += count >= parseInt(nMin) && count <= parseInt(nMax) ? 1 : 0;

    const indices = getIndices(password.split(''), char).map(i => i + 1);
    valid2 += (indices.includes(parseInt(nMax)) ? 1 : 0) + (indices.includes(parseInt(nMin)) ? 1 : 0) === 1 ? 1 : 0;
  }
  console.log('2.1', valid);
  console.log('2.2', valid2);
});
