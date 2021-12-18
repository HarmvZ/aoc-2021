import { moveMessagePortToContext } from 'worker_threads';
import { create2DArray, readInput } from './utils';

interface Pos {
  x: number;
  y: number;
};
readInput(17, 2021).then(input => {
  // input = 'target area: x=20..30, y=-10..-5';
  const targetAreaStrArr: number[][] = input.substring(12).split(', ')
    .map(l => l.trim().split('='))
    .map(l => l[1].split('..').map(i => parseInt(i)));
  const targetArea: [Pos, Pos] = [
    { x: targetAreaStrArr[0][0], y: targetAreaStrArr[1][0] },
    { x: targetAreaStrArr[0][1], y: targetAreaStrArr[1][1] }
  ];

  // Determine min/max values
  const xvFn = (x: number): number => x < 1 ? 0 : xvFn(x - 1) + x;
  let minXV = 0;
  while (xvFn(minXV) < targetArea[0].x) {
    minXV++;
  }

  const minXPos = targetArea[0].x;
  const minYPos = targetArea[0].y;
  const maxXPos = targetArea[1].x;
  const maxYPos = targetArea[1].y;

  const yvFn = (y: number): number => yvFn(y - 1) - 1;
  const minYV = 0;

  // for (let x = minXV; x < maxXV; x++) {
  // }

  interface Match extends Pos {
    maxY: number;
  }
  const matches: Match[] = [];

  for (let x = minXV; x < 500; x++) {
    for (let y = minYPos; y < 500; y++) {
      let outOfBounds = false;
      let match = false;
      let xV = x;
      let yV = y;
      let xPos = 0;
      let yPos = 0;
      let maxY = y;
      while (!outOfBounds && !match) {
        xPos = xPos + xV;
        yPos = yPos + yV;
        maxY = yPos > maxY ? yPos : maxY;
        xV = xV === 0 ? xV : xV > 0 ? xV - 1 : xV + 1;
        yV = yV - 1;
        if (xPos > maxXPos || yPos < minYPos) {
          outOfBounds = true;
        }
        if (xPos >= minXPos && xPos <= maxXPos && yPos >= minYPos && yPos <= maxYPos) {
          matches.push({ x, y, maxY });
          console.log('match: ', x, y, maxY);
          match = true;
        }
      }
    }
  }
  let maxY = 0;
  matches.forEach(m => { maxY = Math.max(m.maxY, maxY); });
  console.log('17.1', maxY);
  console.log('17.2', matches.length);
});
