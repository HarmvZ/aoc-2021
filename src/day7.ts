import * as crabPositions from './inputs/day7.json';
// const crabPositions = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14];

const calculateCost = (pos: number): number => {
  let cost = 0;
  crabPositions.forEach(crabPos => {
    cost += Math.abs(crabPos - pos);
  });
  return cost;
};

// Naive? (checks all existing positions)
const start = Math.min(...crabPositions);
const end = Math.max(...crabPositions);
let lowestCost = -1;
for (let i = start; i <= end; i++) {
  const cost = calculateCost(i);
  if (lowestCost === -1 || cost < lowestCost) {
    lowestCost = cost;
  }
}
console.log('7.1:', lowestCost);// 352707

// 7.2
const range: number[] = [...Array(end + 1).keys()];
const stepCost: number[] = [];
for (const i of range) {
  const prevCost: number = i === 0 ? 0 : stepCost[i - 1];
  stepCost.push(prevCost + i);
}
const calculateComplexCost = (pos: number): number => {
  let cost = 0;
  crabPositions.forEach(crabPos => {
    cost += stepCost[Math.abs(crabPos - pos)];
  });
  return cost;
};

lowestCost = -1;
for (let i = start; i <= end; i++) {
  const cost = calculateComplexCost(i);
  if (lowestCost === -1 || cost < lowestCost) {
    lowestCost = cost;
  }
}
console.log('7.2:', lowestCost);// 95519693
