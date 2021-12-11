import { readInput } from './utils';

readInput(11, 2021).then(input => {
//   input = `5483143223
// 2745854711
// 5264556173
// 6141336146
// 6357385478
// 4167524645
// 2176841721
// 6882881134
// 4846848554
// 5283751526`;// example input
  // console.log(input);
  const lines: number[][] = input.split('\n').map(l => l.trim().split('').map(o => parseInt(o)));

  type Position = {
    x: number;
    y: number;
  }

  let flashes = 0;
  for (let step = 0; step < 1000; step++) {
    // increase by 1 and gather > 9
    const flashPositions:Position[] = [];
    for (let y = 0; y < lines.length; y++) {
      for (let x = 0; x < lines[y].length; x++) {
        lines[y][x] += 1;
        if (lines[y][x] > 9) {
          flashPositions.push({
            x, y
          });
        }
      }
    }

    // flash
    const flashedPositions: Position[] = [];
    while (flashPositions.length > 0) {
      const { x, y } = flashPositions.shift();
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          if (lines[y + i]?.[x + j]) {
            lines[y + i][x + j] += 1;
            if (lines[y + i][x + j] > 9 && flashPositions.filter(p => p.x === x + j && p.y === y + i).length === 0 && flashedPositions.filter(p => p.x === x + j && p.y === y + i).length === 0) {
              flashPositions.unshift({ x: x + j, y: y + i });
            }
          }
        }
      }
      flashedPositions.push({ x, y });
      flashes += 1;
    }

    // Reset > 9 to 0
    for (let y = 0; y < lines.length; y++) {
      for (let x = 0; x < lines[y].length; x++) {
        if (lines[y][x] > 9) {
          lines[y][x] = 0;
        }
      }
    }

    // stop when all positions flash at once
    if (flashedPositions.length === lines.length * lines[0].length) {
      console.log('11.2', step + 1);
      break;
    }

    if (step === 99) {
      console.log('11.1', flashes);
    }
  }
});
