import { create2DArray, create3DVolume, getIndices, readInput } from './../utils';

readInput(20, 2020).then((input: string) => {
//   input = `Tile 2311:
// ..##.#..#.
// ##..#.....
// #...##..#.
// ####.#...#
// ##.##.###.
// ##...#.###
// .#.#.#..##
// ..#....#..
// ###...#.#.
// ..###..###

  //           Tile 1951:
  //           #.##...##.
  //           #.####...#
  //           .....#..##
  //           #...######
  //           .##.#....#
  //           .###.#####
  //           ###.##.##.
  //           .###....#.
  //           ..#.#..#.#
  //           #...##.#..

  //           Tile 1171:
  //           ####...##.
  //           #..##.#..#
  //           ##.#..#.#.
  //           .###.####.
  //           ..###.####
  //           .##....##.
  //           .#...####.
  //           #.##.####.
  //           ####..#...
  //           .....##...

  //           Tile 1427:
  //           ###.##.#..
  //           .#..#.##..
  //           .#.##.#..#
  //           #.#.#.##.#
  //           ....#...##
  //           ...##..##.
  //           ...#.#####
  //           .#.####.#.
  //           ..#..###.#
  //           ..##.#..#.

  //           Tile 1489:
  //           ##.#.#....
  //           ..##...#..
  //           .##..##...
  //           ..#...#...
  //           #####...#.
  //           #..#.#.#.#
  //           ...#.#.#..
  //           ##.#...##.
  //           ..##.##.##
  //           ###.##.#..

  //           Tile 2473:
  //           #....####.
  //           #..#.##...
  //           #.##..#...
  //           ######.#.#
  //           .#...#.#.#
  //           .#########
  //           .###.#..#.
  //           ########.#
  //           ##...##.#.
  //           ..###.#.#.

  //           Tile 2971:
  //           ..#.#....#
  //           #...###...
  //           #.#.###...
  //           ##.##..#..
  //           .#####..##
  //           .#..####.#
  //           #..#.#..#.
  //           ..####.###
  //           ..#.#.###.
  //           ...#.#.#.#

  //           Tile 2729:
  //           ...#.#.#.#
  //           ####.#....
  //           ..#.#.....
  //           ....#..#.#
  //           .##..##.#.
  //           .#.####...
  //           ####.#.#..
  //           ##.####...
  //           ##..#.##..
  //           #.##...##.

  //           Tile 3079:
  //           #.#.#####.
  //           .#..######
  //           ..#.......
  //           ######....
  //           ####.#..#.
  //           .#...#.##.
  //           #.#####.##
  //           ..#.###...
  //           ..#.......
  //           ..#.###...`;

  type BorderMatch = {
    // border indication = 0: top, 1: right, 2: bottom, 3: left
    border: number; // indicates border on parent
    matchingId: number; // matching tile id
    matchingBorder: number; // indicates which border on matching
    reversed: boolean; // indicates if matching border is reversed
  }

  class Tile {
    id: number;
    tile: string[] = [];
    borderMatches: BorderMatch[] = [];
    constructor (id: number, tile: string[]) {
      this.id = id;
      this.tile = tile;
    }

    get borders (): string[] {
      // Clockwise order: top, right, bottom, left
      return [
        this.tile[0],
        this.tile.map(i => i[i.length - 1]).join(''),
        this.tile[this.tile.length - 1],
        this.tile.map(i => i[0]).join('')
      ];
    }

    rotate (rotate: number) {
      // rotates tile clockwise by 90 * rotate degrees
      while (rotate > 0) {
        const rotatedTile: string[] = [];
        for (let i = 0; i < this.tile[0].length; i++) {
          rotatedTile.push(this.tile.map(row => row[i]).reverse().join(''));
        }
        this.borderMatches.forEach(bm => {
          bm.border = (bm.border + 1) % 4;
          if (bm.border === 2 || bm.border === 0) {
            bm.reversed = !bm.reversed;
          }
        });
        this.tile = rotatedTile;
        rotate -= 1;
      }
    }

    flip () {
      // flip in x dimension
      const flippedTile: string[] = [];
      for (const [i, row] of this.tile.entries()) {
        flippedTile[i] = row.split('').reverse().join('');
      }
      this.borderMatches.forEach(bm => {
        bm.reversed = [0, 2].includes(bm.border) ? !bm.reversed : bm.reversed;
        bm.border = [1, 3].includes(bm.border) ? (bm.border + 2) % 4 : bm.border;
      });
      this.tile = flippedTile;
    }

    findMatchingBorders (otherTile: Tile) {
      for (const [i, border] of otherTile.borders.entries()) {
        const bmTemplate = { matchingId: otherTile.id, matchingBorder: i, reversed: false };
        const reversed = border.split('').reverse().join('');
        for (const b of [border, reversed]) {
          if (this.borders.includes(b)) {
            this.borderMatches.push({
              ...bmTemplate,
              border: this.borders.indexOf(b),
              reversed: reversed === b
            });
          }
        }
      }
    }
  }

  const tiles: Map<number, Tile> = new Map(input.split('\n\n').map(img => {
    const [idStr, ...image] = img.trim().split('\n').map(l => l.trim());
    const id = parseInt(idStr.substring(5, 9));
    return [id, new Tile(id, image)];
  }));

  for (const [id, image] of tiles) {
    for (const [id1, image1] of tiles) {
      if (id === id1) {
        continue;
      }
      image.findMatchingBorders(image1);
    }
  }

  const cornerTiles = [...tiles.values()].filter(t => t.borderMatches.length === 2);
  const cornerSum = cornerTiles.reduce((p, c) => c.id * p, 1);

  console.log('20.1', cornerSum);

  // Assemble image (string[]) and remove borders
  const dimSize = Math.sqrt(tiles.size);
  const tileMap: Tile[][] = create2DArray(dimSize, dimSize);

  // Determine orientation of first corner
  const sortedBorders = cornerTiles[0].borderMatches.map(bm => bm.border).sort();
  let rotateRight = 0;
  if (sortedBorders[0] === 0 && sortedBorders[1] === 1) {
    rotateRight = 1;
  } else if (sortedBorders[0] === 2 && sortedBorders[1] === 3) {
    rotateRight = 3;
  } else if (sortedBorders[0] === 0 && sortedBorders[1] === 3) {
    rotateRight = 2;
  }

  tileMap[0][0] = cornerTiles[0];
  tileMap[0][0].rotate(rotateRight);
  for (let y = 0; y < dimSize; y++) {
    for (let x = 0; x < dimSize; x++) {
      if (x === 0 && y === 0) {
        continue; // skip first
      }
      // left tile
      const left = tileMap[y][x - 1];
      const top = tileMap[y - 1]?.[x];

      // find matching tile
      let borderMatchLeft: BorderMatch | null = null;
      let borderMatchTop: BorderMatch | null = null;
      if (left) {
        borderMatchLeft = left.borderMatches.find(bm => bm.border === 1);
      }
      if (top) {
        borderMatchTop = top.borderMatches.find(bm => bm.border === 2);
      }
      console.assert(borderMatchLeft && borderMatchTop ? borderMatchTop.matchingId === borderMatchLeft.matchingId : true);
      const matchingTile = tiles.get((borderMatchLeft || borderMatchTop).matchingId);

      if (left) {
        const bm = borderMatchLeft;
        if (bm.matchingBorder === 0) {
          if (bm.reversed) {
            matchingTile.rotate(3);
          } else {
            matchingTile.rotate(1);
            matchingTile.flip();
          }
        } else if (bm.matchingBorder === 1) {
          if (bm.reversed) {
            matchingTile.rotate(2);
          } else {
            matchingTile.flip();
          }
        } else if (bm.matchingBorder === 2) {
          if (bm.reversed) {
            matchingTile.flip();
            matchingTile.rotate(1);
          } else {
            matchingTile.rotate(1);
          }
        } else if (bm.matchingBorder === 3) {
          if (bm.reversed) {
            matchingTile.flip();
            matchingTile.rotate(2);
          }
        }
      } else {
        const bm = borderMatchTop;
        if (bm.matchingBorder === 0) {
          if (bm.reversed) {
            matchingTile.flip();
          }
        } else if (bm.matchingBorder === 1) {
          if (bm.reversed) {
            matchingTile.flip();
            matchingTile.rotate(1);
          } else {
            matchingTile.rotate(3);
          }
        } else if (bm.matchingBorder === 2) {
          if (bm.reversed) {
            matchingTile.rotate(2);
          } else {
            matchingTile.flip();
            matchingTile.rotate(2);
          }
        } else if (bm.matchingBorder === 3) {
          if (bm.reversed) {
            matchingTile.rotate(1);
          } else {
            matchingTile.rotate(1);
            matchingTile.flip();
          }
        }
      }
      tileMap[y][x] = matchingTile;
    }
  }

  const combineTileMap = (tileMap: Tile[][]) => {
    const result: string[] = [];
    const tileSize = tileMap[0][0].tile.length;
    for (let y = 0; y < tileMap.length; y++) {
      for (let y1 = 1; y1 < tileSize - 1; y1++) {
        result.push(
          tileMap[y].map(t => t.tile[y1].substring(1, t.tile[y1].length - 1)).reduce((prev, cur) => prev + cur, '')
        );
      }
    }
    return result;
  };

  const resultMap = new Tile(0, combineTileMap(tileMap));

  // Find seamonsters
  const seamonster = [
    '                  # ',
    '#    ##    ##    ###',
    ' #  #  #  #  #  #   '
  ];
  const compareLinesIgnoreSpaces = (mapLine: string, monsterLine: string): boolean => {
    return mapLine.split('').every((c, i) => monsterLine[i] === ' ' || c === monsterLine[i]);
  };
  const findMonsters = (monsterMap: string[]): boolean[][] => {
    const matches: boolean[][] = create2DArray(monsterMap[0].length, monsterMap.length, false);
    for (let y = 0; y < monsterMap.length - 2; y++) {
      for (let x = 0; x < monsterMap[y].length - seamonster[0].length + 1; x++) {
        if (seamonster.every((line, i) => {
          return compareLinesIgnoreSpaces(monsterMap[y + i].substring(x, line.length), line);
        })) {
          // match, draw on monsters
          matches[y][x + 18] = true;
          matches[y + 1][x] = true;
          matches[y + 1][x + 5] = true;
          matches[y + 1][x + 6] = true;
          matches[y + 1][x + 11] = true;
          matches[y + 1][x + 12] = true;
          matches[y + 1][x + 17] = true;
          matches[y + 1][x + 18] = true;
          matches[y + 1][x + 19] = true;
          matches[y + 2][x + 1] = true;
          matches[y + 2][x + 4] = true;
          matches[y + 2][x + 7] = true;
          matches[y + 2][x + 10] = true;
          matches[y + 2][x + 13] = true;
          matches[y + 2][x + 16] = true;
        }
      }
    }
    return matches;
  };
  console.log(resultMap.tile.join('\n'));

  let monsters = findMonsters(resultMap.tile);
  let i = 0;
  while (monsters.some(l => l.some(c => c)) && i < 20) {
    if (i % 4 === 0) {
      console.log('Flipping');
      resultMap.flip();
    } else {
      console.log('Rotating');
      resultMap.rotate(1);
    }
    monsters = findMonsters(resultMap.tile);
    i++;
  }

  const excludedMap: string[] = [];
  for (const [y, line] of resultMap.tile.entries()) {
    excludedMap[y] = line.split('').map((c, x) => monsters[y][x] ? '.' : c).join('');
  }

  const countPounds = (tile: string[]): number => {
    return tile.reduce((prev, cur) => prev + getIndices(cur.split(''), '#').length, 0);
  };
  console.log(monsters);
  console.log(countPounds(excludedMap));

  // 1963 too low
});
