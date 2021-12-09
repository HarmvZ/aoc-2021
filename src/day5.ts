import * as ventLines from './inputs/day5.json';
// const ventLines = [
//   '0,9 -> 5,9',
//   '8,0 -> 0,8',
//   '9,4 -> 3,4',
//   '2,2 -> 2,1',
//   '7,0 -> 7,4',
//   '6,4 -> 2,0',
//   '0,9 -> 2,9',
//   '3,4 -> 1,4',
//   '0,0 -> 8,8',
//   '5,5 -> 8,2'
// ];

type Point = {
  x: number;
  y: number;
}
type Line = {
  start: Point;
  end: Point;
}
type FloorMap = number[][][];

const lines: Line[] = ventLines.map(l => {
  const points = l.split(' -> ').map(
    c => ({ y: parseInt(c.split(',')[0]), x: parseInt(c.split(',')[1]) })
  );
  return { start: points[0], end: points[1] };
});

// find max x and y
let maxX = 0;
let maxY = 0;
lines.forEach(line => {
  maxX = Math.max(line.start.x, line.end.x, maxX);
  maxY = Math.max(line.start.y, line.end.y, maxY);
});

// Creat empty floor
const floorMap: FloorMap = [];
for (let x = 0; x < maxX + 1; x++) {
  floorMap[x] = [];
  for (let y = 0; y < maxY + 1; y++) {
    floorMap[x][y] = [];
  }
}

const drawStraightLine = (index: number, line: any, dim: string, floorMap: FloorMap) => {
  const start = line.start[dim] > line.end[dim] ? line.end[dim] : line.start[dim];
  const end = line.start[dim] > line.end[dim] ? line.start[dim] : line.end[dim];
  for (let i = start; i <= end; i++) {
    const arr = dim === 'x' ? floorMap[i][line.start.y] : floorMap[line.start.x][i];
    arr.push(index);
  }
};
// fill with orthogonal lines
lines.forEach((line, index) => {
  if (line.start.x === line.end.x) {
    drawStraightLine(index, line, 'y', floorMap);
  }
  if (line.start.y === line.end.y) {
    drawStraightLine(index, line, 'x', floorMap);
  }
});

// find double or or more overlaps
let overlaps: number = 0;
floorMap.forEach(row => {
  row.forEach(cell => {
    overlaps += cell.length > 1 ? 1 : 0;
  });
});
console.log('5.1:', overlaps);// 5124

// Draw diagonal lines
lines.forEach((line, index) => {
  if (line.start.x === line.end.x && line.end.y === line.start.y) {
    console.log(line);
  }
  const xDist = Math.abs(line.start.x - line.end.x);
  const yDist = Math.abs(line.start.y - line.end.y);
  if (xDist === yDist) {
    let x = line.start.x;
    let y = line.start.y;
    const xStep = (line.end.x - line.start.x) / xDist;
    const yStep = (line.end.y - line.start.y) / yDist;
    for (let step = 0; step <= xDist; step++) {
      floorMap[x][y].push(index);
      x += xStep;
      y += yStep;
    }
  }
});

// find double or or more overlaps
let overlaps2: number = 0;
floorMap.forEach(row => {
  row.forEach(cell => {
    overlaps2 += cell.length > 1 ? 1 : 0;
  });
  // draw diagram
  // console.log(row.map(c => c.length === 0 ? '.' : c.length).join(''));
});
console.log('5.2:', overlaps2);// 19771
