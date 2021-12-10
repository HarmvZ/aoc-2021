import { multiply, readInput } from '../utils';

readInput(3, 2020).then(input => {
  //   input = `..##.......
  // #...#...#..
  // .#....#..#.
  // ..#.#...#.#
  // .#...##..#.
  // ..#.##.....
  // .#.#.#....#
  // .#........#
  // #.##...#...
  // #...##....#
  // .#..#...#.#`;// example input
  const map = input.split('\n').map(
    p => p.split('')
  );
  const traverse = (stepX: number, stepY: number): number => {
    let end = false;
    const pos = { x: 0, y: 0 };
    let trees = 0;
    while (!end) {
      trees += map[pos.y][pos.x] === '#' ? 1 : 0;
      pos.x += stepX;
      pos.y += stepY;
      pos.x %= map[0].length;
      if (pos.y >= map.length) {
        end = true;
      }
    }
    return trees;
  };

  console.log('3.1', traverse(3, 1));

  const result2 = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]].map(
    ([x, y]) => traverse(x, y)
  );
  console.log('3.2', multiply(result2));
});
