import { create2DArray, getIndices, readInput } from './utils';

readInput(13, 2021).then(input => {
//   input = `6,10
// 0,14
// 9,10
// 0,3
// 10,4
// 4,11
// 6,0
// 6,12
// 4,1
// 0,13
// 10,12
// 3,4
// 3,0
// 8,4
// 1,10
// 2,14
// 8,10
// 9,0

  //   fold along y=7
  //   fold along x=5`;// example input

  type Dot = {
    x: number;
    y: number;
  }
  type Fold = {
    axis: keyof Dot;
    value: number;
  }
  const [dotsArr, foldsArr] = input.split('\n\n').map(l => l.trim().split('\n').map(l => l.trim()));
  const dots: Dot[] = dotsArr.map(d => {
    const dot = d.split(',').map(i => parseInt(i));
    return { x: dot[0], y: dot[1] };
  });
  const folds = foldsArr.map(f => {
    const [axis, value]: (keyof Dot | string)[] = f.substring(11).split('=');
    return { axis: axis as keyof Dot, value: parseInt(value) };
  });

  const fold = (paper: Dot[], fold: Fold): Dot[] => {
    const maxSize: Dot = {
      x: Math.max(...paper.map(d => d.x)),
      y: Math.max(...paper.map(d => d.y))
    };
    if (maxSize[fold.axis] > fold.value * 2) {
      // enlarge above
      const diff = maxSize[fold.axis] - fold.value * 2;
      maxSize[fold.axis] += diff;
      paper = paper.map(d => ({ ...d, [fold.axis]: d[fold.axis] + diff }));
    }
    if (maxSize[fold.axis] < fold.value * 2) {
      // enlarge below
      const diff = fold.value * 2 - maxSize[fold.axis];
      maxSize[fold.axis] += diff;
    }

    const result: Dot[] = [];
    for (const dot of paper) {
      const newDot = { x: dot.x, y: dot.y };
      if (dot[fold.axis] > fold.value) {
        newDot[fold.axis] = maxSize[fold.axis] - newDot[fold.axis];
      }
      if (!result.some(({ x, y }) => x === newDot.x && y === newDot.y)) {
        result.push(newDot);
      }
    }
    return result;
  };

  const result = fold(dots.slice(), folds[0]);

  console.log('13.1', result.length);

  let paper = dots.slice();
  folds.forEach(f => {
    paper = fold(paper, f);
  });

  const maxSize: Dot = {
    x: Math.max(...paper.map(d => d.x)),
    y: Math.max(...paper.map(d => d.y))
  };
  const graph: string[][] = create2DArray(maxSize.x + 1, maxSize.y + 1, '.');
  for (const dot of paper) {
    graph[dot.y][dot.x] = '#';
  }
  console.log('13.2:');
  console.log(graph.map(l => l.join('')).join('\n'));
});
