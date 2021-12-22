import path = require('path/posix');
import { readInput } from './../utils';

readInput(10, 2020).then((input: string) => {
  input = `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`;
  input = `16
  10
  15
  5
  1
  11
  7
  19
  6
  12
  4`;

  const ratings: number[] = input.split('\n').map(i => parseInt(i));

  const builtIn = Math.max(...ratings) + 3;
  ratings.push(builtIn);

  const diffSum = [0, 0, 0, 0];
  let currentRatings = ratings.slice();
  let currentRating = 0;
  while (currentRatings.length > 0) {
    for (let i = 0; i <= 3; i++) {
      const match = currentRatings.findIndex(r => r === currentRating + i);
      if (match !== -1) {
        currentRating = currentRatings[match];
        currentRatings = [...currentRatings.slice(0, match), ...currentRatings.slice(match + 1)];
        diffSum[i] += 1;
        break;
      }
    }
  }

  console.log('10.1', diffSum[1] * diffSum[3]);

  // currentRatings = ratings.slice();
  // currentRating = 0;
  // const possibilities = [];
  // while (currentRatings.length > 0) {
  //   const matches = [];
  //   for (let i = 0; i <= 3; i++) {
  //     const match = currentRatings.findIndex(r => r === currentRating + i);
  //     if (match !== -1) {
  //       matches.push(match);
  //     }
  //   }
  //   possibilities.push(matches.length);
  //   const match = matches[0];
  //   currentRating = currentRatings[match];
  //   currentRatings = [...currentRatings.slice(0, match), ...currentRatings.slice(match + 1)];
  // }

  // let total = 0;
  // let curTotal = 1;
  // for (const i in possibilities) {
  //   const cur = possibilities[i];
  //   if (cur === 1) {
  //     total += curTotal > 1 ? curTotal : 0;
  //     curTotal = 1;
  //   } else {
  //     curTotal *= cur;
  //   }
  // }

  // currentRatings = ratings.slice().reverse();
  // currentRating = 0;
  // const possibilities1 = [];
  // while (currentRatings.length > 0) {
  //   const matches = [];
  //   for (let i = 0; i <= 3; i++) {
  //     const match = currentRatings.findIndex(r => r === currentRating + i);
  //     if (match !== -1) {
  //       matches.push(match);
  //     }
  //   }
  //   possibilities1.push(matches.length);
  //   const match = matches[0];
  //   currentRating = currentRatings[match];
  //   currentRatings = [...currentRatings.slice(0, match), ...currentRatings.slice(match + 1)];
  // }

  // const sortedRatings = ratings.slice().sort((a, b) => a - b).reverse();
  // sortedRatings.unshift(0);
  // const pos2: number[] = [];
  // for (const r of sortedRatings) {
  //   let p = 0;
  //   for (let j = 1; j < 4; j++) {
  //     if (sortedRatings.indexOf(r - j) !== -1) {
  //       p += 1;
  //     }
  //   }
  //   pos2.push(p);
  // }

  const sortedRatings = [0, ...ratings.slice().sort((a, b) => a - b)];

  const traverse = (prevPath: number[]): number[][] => {
    console.log(prevPath);
    const paths = [];
    const currentRating = prevPath[prevPath.length - 1];
    const i = prevPath.length - 1;
    for (let j = 1; j < 4; j++) {
      if ((currentRating + 3) >= sortedRatings[i + j]) {
        paths.push([...prevPath, sortedRatings[i + j]]);
      }
    }
    const finishedPaths = paths.filter(p => p[p.length - 1] === builtIn);
    const unfinishedPaths = paths.filter(p => p[p.length - 1] !== builtIn);
    const traversedPaths = unfinishedPaths.reduce((prev, p) => [...prev, ...traverse(p)], [] as number[][]);
    return [
      ...finishedPaths,
      ...traversedPaths
    ];
  };

  const paths = traverse([0]);

  console.log('10.2', paths.length);
});
