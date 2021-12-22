import { readInput } from './utils';

readInput(21, 2021).then(input => {
//   input = `Player 1 starting position: 4
// Player 2 starting position: 8`;
  const starts = input.split('\n').map(l => l.trim().replace('Player ', '').split(' starting position: ')).map(l1 => parseInt(l1[1]));

  let detDie = 0;
  const rollDie = (): number => {
    detDie += 1;
    detDie = detDie > 100 ? detDie - 100 : detDie;
    return detDie;
  };

  const scores: number[] = [0, 0];
  const positions: number[] = starts.slice();
  let turn = 0;
  let dieCount = 0;
  let currentPlayer: 0 | 1 = 0;
  while (scores[0] < 1000 && scores[1] < 1000) {
    dieCount += rollDie();
    turn++;
    if (turn % 3 === 0) {
      positions[currentPlayer] += dieCount;
      positions[currentPlayer] = positions[currentPlayer] % 10 === 0 ? 10 : positions[currentPlayer] % 10;
      scores[currentPlayer] += positions[currentPlayer];
      currentPlayer = currentPlayer === 0 ? 1 : 0;
      dieCount = 0;
    }
  }
  const winner = scores[0] >= 1000 ? 0 : 1;

  console.log('21.1', turn * scores[winner ? 0 : 1]);

  const calculateScore = (path: number[], starts: [number, number]): [number, number] => {
    const scores: [number, number] = [0, 0];
    const pos = starts.slice();
    path.forEach((p, i) => {
      const player = i % 2;
      pos[i % 2] += p;
      pos[i % 2] = pos[i % 2] % 10 === 0 ? 10 : pos[i % 2] % 10;
      scores[i % 2] += pos[i % 2];
    });
    return scores;
  };

  const dieOptions = [3, 4, 4, 4, 5, 5, 5, 6, 7, 7, 7, 8, 8, 8, 9];
  // const paths: number[][] = [[]];
  const wins: [number, number] = [0, 0];

  // type PlayerState = {
  //   pos: number;
  //   score: number;
  // };
  // type GameState = {
  //   player1: PlayerState;
  //   player2: PlayerState;
  // };

  // const states: GameState[] = [{ player1: { pos: starts[0], score: 0 }, player2: { pos: starts[1], score: 0 } }];

  type StateCountMap = Map<string, number>;
  const stateCounts: [StateCountMap, StateCountMap] = [new Map(), new Map()];
  for (let pos = 1; pos < 11; pos++) {
    for (let score = 0; score < 21; score++) {
      const key = pos.toString() + '-' + score.toString();
      stateCounts[0].set(key, 0);
      stateCounts[1].set(key, 0);
    }
  }
  stateCounts[0].set(starts[0].toString() + '-0', 1);
  stateCounts[1].set(starts[1].toString() + '-0', 1);

  const getTotalCounts = (sc: typeof stateCounts): number => {
    return sc.reduce((prev, cur) => prev + [...cur.values()].reduce((p1, c1) => p1 + c1, 0), 0);
  };
  turn = 0;
  while (getTotalCounts(stateCounts) > 0) {
    const stateCount = stateCounts[turn % 2];
    for (const [state, count] of stateCount) {
      if (count > 0) {
        let [pos, score] = state.split('-').map(i => parseInt(i));
        for (const o of dieOptions) {
          pos = pos + o;
          pos = pos % 10 === 0 ? 10 : pos % 10;
          score = score + pos;
          const newState = pos.toString() + '-' + score.toString();
          if (score > 20) {
            wins[turn % 2]++;
          } else {
            stateCount.set(newState, stateCount.get(newState) + 1);
          }
          stateCount.set(state, count - 1);
        }
      }
    }
    turn++;
    console.log(getTotalCounts(stateCounts));
  }

  console.log('21.2', wins);
});
