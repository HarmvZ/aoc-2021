import * as gameData from './inputs/day4.json';
// const gameData = {
// numbers: [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1],
// boards: '22 13 17 11  0\n 8  2 23  4 24\n21  9 14 16  7\n 6 10  3 18  5\n 1 12 20 15 19\n\n 3 15  0  2 22\n 9 18 13 17  5\n19  8  7 25 23\n20 11 10 24  4\n14 21 16 12  6\n\n14 21 17 24  4\n10 16 15  9 19\n18  8 23 26 20\n22 11 13  6  5\n 2  0 12  3  7'
// };

type Cell = {
  value: number;
  marked: boolean;
}
type Board = Cell[][];

const currentBoards: Board[] = gameData.boards
  .split('\n\n').map(board => board
    .split('\n').map(row => row
      .trim().split(/ +/).map(
        digit => ({ value: parseInt(digit), marked: false })
      )
    )
  );

const markNumber = (number: number, boards: Board[]) => {
  for (const board of boards) {
    for (const row of board) {
      for (const cell of row) {
        cell.marked = cell.value === number ? true : cell.marked;
      }
    }
  }
};

const findWinners = (boards: Board[]): Board[] => {
  const winners = [];
  for (const board of boards) {
    let won = false;
    for (const row of board) {
      if (row.reduce((prev, cur) => prev && cur.marked, true)) {
        won = true;
        break;
      }
    }
    for (const index in board[0]) {
      const column = board.map(row => row[index]);
      if (column.reduce((prev, cur) => prev && cur.marked, true)) {
        won = true;
        break;
      }
    }
    if (won) {
      winners.push(board);
      continue;
    }
  }
  return winners;
};

const calculateUnmarkedSum = (board: Board): number => {
  return board.reduce(
    (prev, row) => prev + row.reduce(
      (prev, cell) => prev + (!cell.marked ? cell.value : 0)
      , 0)
    , 0);
};

for (const drawnNumber of gameData.numbers) {
  markNumber(drawnNumber, currentBoards);
  const winningBoards = findWinners(currentBoards);
  if (winningBoards.length > 0) {
    const unmarkedSum = calculateUnmarkedSum(winningBoards[0] as Board);
    console.log('4.1:', unmarkedSum * drawnNumber);// 8442
    break;
  }
}

// 4.2
// reset boards
currentBoards.forEach(b => b.forEach(r => r.forEach(c => { c.marked = false; })));

let playingBoards = currentBoards.slice();
for (const [numberIndex, drawnNumber] of gameData.numbers.entries()) {
  markNumber(drawnNumber, playingBoards);
  const winningBoards = findWinners(playingBoards);
  if (winningBoards.length > 0) {
    if (playingBoards.length === 1 || numberIndex === gameData.numbers.length - 1) {
      const unmarkedSum = calculateUnmarkedSum(winningBoards[0] as Board);
      console.log('4.2:', unmarkedSum * drawnNumber);// 4590
      break;
    }
    // remove winning board from playing boards
    playingBoards = playingBoards.filter(b => !winningBoards.includes(b));
  }
}
