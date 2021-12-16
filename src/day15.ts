import { create2DArray, readInput } from './utils';

readInput(15, 2021).then(input => {
//   input = `1163751742
// 1381373672
// 2136511328
// 3694931569
// 7463417111
// 1319128137
// 1359912421
// 3125421639
// 1293138521
// 2311944581`;// example input

  const map = input.split('\n').map(l => l.trim().split('').map(i => parseInt(i)));

  type Pos = {
    x: number;
    y: number;
  }

  // const calculateNextCosts = (currentPos: Pos) => {
  //   const currentCost = costPerPos[currentPos.y][currentPos.x];
  //   for (const dim of (['x', 'y'] as (keyof Pos)[])) {
  //     for (let d = -1; d < 2; d += 2) {
  //       const nextPos = { ...currentPos };
  //       nextPos[dim] += d;
  //       if (nextPos[dim] < 0 || nextPos[dim] >= map.length) {
  //         continue;
  //       }
  //       const nextCost = currentCost + map[nextPos.y][nextPos.x];
  //       if (nextCost < costPerPos[nextPos.y][nextPos.x]) {
  //         costPerPos[nextPos.y][nextPos.x] = nextCost;
  //         calculateNextCosts(nextPos);
  //       }
  //     }
  //   }
  // };

  // const currentPos: Pos = { x: 0, y: 0 };
  // const costPerPos = create2DArray(dimSize, dimSize, Infinity);
  // costPerPos[0][0] = 0;
  // calculateNextCosts(currentPos); max call stack exceeded :(

  const getLowestAdjacent = (pos: Pos, costPerPos: number[][], dimSize: number): number => {
    const costs: number[] = [];
    for (const dim of (['x', 'y'] as (keyof Pos)[])) {
      for (let d = -1; d < 2; d += 2) {
        const adjacentPos = { ...pos };
        adjacentPos[dim] += d;
        if (adjacentPos[dim] < 0 || adjacentPos[dim] >= dimSize) {
          continue;
        }
        costs.push(costPerPos[adjacentPos.y][adjacentPos.x]);
      }
    }
    return Math.min(...costs);
  };

  const findCheapestRoute = (costMap: number[][]): number[][] => {
    const dimSize = costMap.length;
    const costPerPos = create2DArray(dimSize, dimSize, Infinity);
    costPerPos[0][0] = 0;
    let change = true;
    while (change) {
      change = false;
      for (let x = 0; x < dimSize; x++) {
        for (let y = 0; y < dimSize; y++) {
          const currentCost = costPerPos[y][x];
          const lowestAdjacent = getLowestAdjacent({ x, y }, costPerPos, dimSize);
          const newCost = lowestAdjacent + costMap[y][x];
          if (newCost < currentCost) {
            costPerPos[y][x] = newCost;
            change = true;
          }
        }
      }
    }
    return costPerPos;
  };

  const costPerPos = findCheapestRoute(map);
  console.log(costPerPos.map(l => l.map(d => d.toString().padStart(3)).join(' ')).join('\n'));
  console.log('15.1', costPerPos[costPerPos.length - 1][costPerPos[0].length - 1]);

  const increaseByXAndWrap = (v: number, x:number): number => v + x > 9 ? (v + x) % 9 : v + x;
  const map2: number[][] = [];
  for (let i = 0; i < 5; i++) {
    map.forEach((line, y) => {
      const newLine = [];
      for (let j = 0; j < 5; j++) {
        newLine.push(...line.map(v => increaseByXAndWrap(v, j)));
      }
      map2[y + i * map.length] = newLine.map(v => increaseByXAndWrap(v, i));
    });
  }

  const costPerPos2 = findCheapestRoute(map2);
  console.log('15.2', costPerPos2[costPerPos2.length - 1][costPerPos2[0].length - 1]);
});
