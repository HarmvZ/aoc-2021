import * as initialFish from './inputs/day6.json';
// const initialFish = [3, 4, 3, 1, 2];

// Naive implementation (6.1)
const currentFish = initialFish.slice();
for (let day = 0; day < 80; day++) {
  for (const fishIndex in currentFish) {
    currentFish[fishIndex] -= 1;
    if (currentFish[fishIndex] === -1) {
      currentFish[fishIndex] = 6;
      currentFish.push(8);
    }
  }
  console.log('day', day + 1, 'nr of fish', currentFish.length); // 380758
}

// Non naive
let ageMap: number[] = new Array(9).fill(0);
for (const [age, _] of ageMap.entries()) {
  ageMap[age] = initialFish.filter(fish => fish === age).length;
}
for (let day = 0; day < 256; day++) {
  const newAgeMap = new Array(9).fill(0);
  for (const [age, nr] of ageMap.entries()) {
    if (age === 0) {
      newAgeMap[6] = ageMap[7] + nr;
      newAgeMap[8] = nr;
    } else if (age === 7) {
      continue;
    } else {
      newAgeMap[age - 1] = nr;
    }
  }
  ageMap = newAgeMap;
  console.log('day', day + 1, 'nr of fish', ageMap.reduce((prev, cur) => prev + cur, 0));// 1710623015163
}
