import { readInput } from './../utils';

readInput(11, 2020).then((input: string) => {
//   input = `L.LL.LL.LL
// LLLLLLL.LL
// L.L.L..L..
// LLLL.LL.LL
// L.LL.LL.LL
// L.LLLLL.LL
// ..L.L.....
// LLLLLLLLLL
// L.LLLLLL.L
// L.LLLLL.LL`;

  const layout = input.split('\n').map(l => l.trim().split(''));

  const countAdjacentOccupied = (arr: string[][], row: number, col: number): number => {
    let occupied = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        const val = arr[row + i]?.[col + j];
        occupied += val === '#' ? 1 : 0;
      }
    }
    return occupied;
  };

  const shiftUntilBalanced = (layout: string[][], adjacentFn: typeof countAdjacentOccupied, occupied: number): string[][] => {
    let changed = true;
    while (changed) {
      const newLayout = JSON.parse(JSON.stringify(layout));
      layout.forEach((row, i) => {
        row.forEach((v, j) => {
          const occ = adjacentFn(layout, i, j);
          if (v === 'L' && occ === 0) {
            newLayout[i][j] = '#';
          } else if (v === '#' && occ > occupied) {
            newLayout[i][j] = 'L';
          }
        });
      });
      if (JSON.stringify(layout) === JSON.stringify(newLayout)) {
        changed = false;
      }
      layout = newLayout;
    }
    return layout;
  };

  const resultLayout = shiftUntilBalanced(layout, countAdjacentOccupied, 3);
  const occ = resultLayout.reduce((prev, cur) => prev + cur.reduce((prev, cur) => prev + (cur === '#' ? 1 : 0), 0), 0);
  console.log('11.1', occ);
  const countFarAdjacent = (arr: string[][], row: number, col: number): number => {
    let occupied = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        let val = arr[row + i]?.[col + j];
        let k = 2;
        while (val === '.') {
          val = arr[row + i * k]?.[col + j * k];
          k++;
        }
        occupied += val === '#' ? 1 : 0;
      }
    }
    return occupied;
  };

  const resultLayout2 = shiftUntilBalanced(layout, countFarAdjacent, 4);
  const occ2 = resultLayout2.reduce((prev, cur) => prev + cur.reduce((prev, cur) => prev + (cur === '#' ? 1 : 0), 0), 0);
  console.log('11.2', occ2);
});
