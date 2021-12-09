import * as directions from './inputs/day2.json';

const forward: number = directions.filter(d => d.startsWith('forward')).reduce((t, c) => t + parseInt(c.slice(8)), 0);
const down: number = directions.filter(d => d.startsWith('down')).reduce((t, c) => t + parseInt(c.slice(5)), 0);
const up: number = directions.filter(d => d.startsWith('up')).reduce((t, c) => t + parseInt(c.slice(3)), 0);
const result1: number = forward * (down - up);
console.log('2.1:', result1);// 2117664

// day2.2
const state: { x: number, y: number, aim: number } = { x: 0, y: 0, aim: 0 };
for (const d of directions) {
  if (d.startsWith('down')) {
    state.aim += parseInt(d.slice(5));
  }
  if (d.startsWith('up')) {
    state.aim -= parseInt(d.slice(3));
  }
  if (d.startsWith('forward')) {
    const val = parseInt(d.slice(8));
    state.x += val;
    state.y += state.aim * val;
  }
}
const result2: number = state.x * state.y;
console.log('2.2:', result2);// 2073416724
