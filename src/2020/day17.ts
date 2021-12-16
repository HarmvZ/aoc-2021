import { create2DArray, create3DVolume, readInput } from './../utils';

readInput(17, 2020).then((input: string) => {
//   input = `.#.
// ..#
// ###`;

  const cubes: boolean[][] = input.split('\n').map(i => i.split('').map(c => c === '#'));

  // pad in all dimensions in both directions
  const pad3D = <T>(volume: T[][][], fill: T): T[][][] => {
    return [
      create2DArray(volume[0][0].length + 2, volume[0].length + 2, fill),
      ...volume.map(slice => [
        new Array(slice.length + 2).fill(fill),
        ...slice.map(row => [fill, ...row, fill]),
        new Array(slice.length + 2).fill(fill)
      ]),
      create2DArray(volume[0][0].length + 2, volume[0].length + 2, fill)
    ];
  };

  const getActiveNeighbors = (volume: boolean[][][], z: number, y: number, x: number): number => {
    let active = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        for (let k = -1; k < 2; k++) {
          if (i === 0 && j === 0 && k === 0) {
            continue;
          }
          active += volume[z + i]?.[y + j]?.[x + k] ? 1 : 0;
        }
      }
    }
    return active;
  };

  let state: boolean[][][] = [cubes];
  for (let step = 0; step < 6; step++) {
    state = pad3D(state, false);
    const newState = JSON.parse(JSON.stringify(state));
    for (let z = 0; z < state.length; z++) {
      for (let y = 0; y < state[z].length; y++) {
        for (let x = 0; x < state[z][y].length; x++) {
          const active = getActiveNeighbors(state, z, y, x);
          if (state[z][y][x]) {
            newState[z][y][x] = [2, 3].includes(active);
          } else {
            newState[z][y][x] = active === 3;
          }
        }
      }
    }
    state = newState;
  }

  console.log('17.1', state.reduce((p1, c1) => p1 + c1.reduce((p2, c2) => p2 + c2.reduce((p3, c3) => p3 + (c3 ? 1 : 0), 0), 0), 0));

  const pad4D = <T>(volume: T[][][][], fill: T): T[][][][] => {
    return [
      create3DVolume(volume[0][0][0].length + 2, volume[0][0].length + 2, volume[0].length + 2, fill),
      ...volume.map(v3D => pad3D(v3D, fill)),
      create3DVolume(volume[0][0][0].length + 2, volume[0][0].length + 2, volume[0].length + 2, fill)
    ];
  };

  const getActiveNeighbors4D = (volume: boolean[][][][], w: number, z: number, y: number, x: number): number => {
    let active = 0;
    for (let h = -1; h < 2; h++) {
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          for (let k = -1; k < 2; k++) {
            if (h === 0 && i === 0 && j === 0 && k === 0) {
              continue;
            }
            active += volume[w + h]?.[z + i]?.[y + j]?.[x + k] ? 1 : 0;
          }
        }
      }
    }
    return active;
  };

  let state4D: boolean[][][][] = [[cubes]];
  for (let step = 0; step < 6; step++) {
    state4D = pad4D(state4D, false);
    const newState4D = JSON.parse(JSON.stringify(state4D));
    for (let w = 0; w < state4D.length; w++) {
      for (let z = 0; z < state4D[w].length; z++) {
        for (let y = 0; y < state4D[w][z].length; y++) {
          for (let x = 0; x < state4D[w][z][y].length; x++) {
            const active = getActiveNeighbors4D(state4D, w, z, y, x);
            if (state4D[w][z][y][x]) {
              newState4D[w][z][y][x] = [2, 3].includes(active);
            } else {
              newState4D[w][z][y][x] = active === 3;
            }
          }
        }
      }
    }
    state4D = newState4D;
  }
  console.log('17.2', state4D.reduce((p0, c0) => p0 + c0.reduce((p1, c1) => p1 + c1.reduce((p2, c2) => p2 + c2.reduce((p3, c3) => p3 + (c3 ? 1 : 0), 0), 0), 0), 0));
});
