import { readInput, getAdjacentElements } from './utils';

type Point = {
  rowIndex: number;
  colIndex: number;
}

const filterExisting = (points: Point[], existing: Point[]): Point[] => {
  return points.filter(p1 => {
    return !existing.reduce((prev, p2) => {
      return prev || (p1.rowIndex === p2.rowIndex && p1.colIndex === p2.colIndex);
    }, false);
  });
};

readInput(9, 2021).then(input => {
//   input = `2199943210
// 3987894921
// 9856789892
// 8767896789
// 9899965678`;// example input
  // console.log(input);
  const heightMap = input.split('\n').map(l => l.split('').map(i => parseInt(i)));
  let lowPointsSum = 0;
  const lowPoints: Point[] = [];
  heightMap.forEach((row, rowIndex, rows) => {
    const adjacentRows = getAdjacentElements(rows, rowIndex);
    row.forEach((v, colIndex, cols) => {
      const adjacentCols = getAdjacentElements(cols, colIndex);
      const higherThan = [...adjacentRows.map(r => r[colIndex] > v), ...adjacentCols.map(c => c > v)];
      if (!higherThan.includes(false)) {
        lowPointsSum += v + 1;
        lowPoints.push({
          rowIndex,
          colIndex
        });
      }
    });
  });
  console.log('9.1:', lowPointsSum);

  const getAdjacentPoints = (point: Point, skip: Point[] = []): Point[] => {
    const adjacent = [];
    if (point.rowIndex - 1 >= 0) {
      adjacent.push({
        rowIndex: point.rowIndex - 1,
        colIndex: point.colIndex
      });
    }
    if (point.rowIndex + 1 < heightMap.length) {
      adjacent.push({
        rowIndex: point.rowIndex + 1,
        colIndex: point.colIndex
      });
    }
    if (point.colIndex - 1 >= 0) {
      adjacent.push({
        rowIndex: point.rowIndex,
        colIndex: point.colIndex - 1
      });
    }
    if (point.colIndex + 1 < heightMap[point.rowIndex].length) {
      adjacent.push({
        rowIndex: point.rowIndex,
        colIndex: point.colIndex + 1
      });
    }
    const filteredAdjacent = filterExisting(adjacent, skip);
    return filteredAdjacent;
  };

  const basins: Point[][] = [];
  lowPoints.forEach((point) => {
    const basin = [point];
    const adjacentPoints = getAdjacentPoints(point);
    const next = adjacentPoints.slice();
    while (next.length > 0) {
      const curPoint = next.shift();
      const value = heightMap[curPoint.rowIndex][curPoint.colIndex];
      if (value !== 9 && basin.filter(p => curPoint.colIndex === p.colIndex && curPoint.rowIndex === p.rowIndex).length === 0) {
        basin.push(curPoint);
        const nextPoints = getAdjacentPoints(curPoint, basin);
        next.push(...nextPoints);
      }
    }
    basins.push(basin);
  });

  basins.sort((a, b) => b.length - a.length);

  console.log('9.2:', basins[0].length * basins[1].length * basins[2].length);
});
