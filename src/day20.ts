import { posix } from 'path/posix';
import { create2DArray, readInput } from './utils';

readInput(20, 2021).then(input => {
  // input = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

  // #..#.
  // #....
  // ##..#
  // ..#..
  // ..###`;
  const [[algo, ..._], inImg] = input.split('\n\n').map(l => l.trim().split('\n').map(l1 => l1.trim()));

  const padimg = (inImg: string[], padChar: string, padLength: number = 4): string[] => {
    return [
      padChar.repeat(inImg[0].length + 2 * padLength),
      ...inImg.map(l => padChar.repeat(padLength) + l + padChar.repeat(padLength)),
      padChar.repeat(inImg[0].length + 2 * padLength),
    ];
  };

  const applyKernel = (inImg: string[], algo: string, padChar: string): string[] => {
    const outImg: string[] = [];
    inImg.forEach((line, y) => {
      let outLine = '';
      line.split('').forEach((c, x) => {
        let binaryStr = '';
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            const char = inImg[y + i]?.[x + j] || padChar;
            binaryStr += char === '#' ? '1' : '0';
          }
        }
        outLine += algo[parseInt(binaryStr, 2)];
      });
      outImg.push(outLine);
    });
    return outImg;
  };

  let img = inImg.slice();
  let padChar = '.';
  for (let step = 0; step < 2; step++) {
    img = padimg(img, padChar);
    img = applyKernel(img, algo, padChar);
    padChar = algo[0] === '#' && padChar === '.' ? '#' : '.';
  }

  const litCount = img.reduce((prev, cur) => prev + [...cur.matchAll(/#/g)].length, 0);
  console.log('20.1', litCount);

  let img1 = inImg.slice();
  padChar = '.';
  for (let step = 0; step < 50; step++) {
    img1 = padimg(img1, padChar);
    img1 = applyKernel(img1, algo, padChar);
    padChar = algo[0] === '#' && padChar === '.' ? '#' : '.';
  }
  const litCount1 = img1.reduce((prev, cur) => prev + [...cur.matchAll(/#/g)].length, 0);
  console.log('20.2', litCount1);
});
