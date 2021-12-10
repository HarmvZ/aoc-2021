import { readInput } from './../utils';

type Range = {
    min: number;
    max: number;
};

type Seat = {
  row: number,
  column: number,
  id: number,
}

readInput(5, 2020).then((input: string) => {
  // input = 'FBFBBFFRLR\nBFFFBBFRRR\nFFFBBBFRRR\nBBFFBBFRLL';// example input
  const directions = input.split('\n').map(l => [l.substring(0, 7).split(''), l.substring(7, 10).split('')]);
  const seats: Seat[] = [];
  directions.forEach(d => {
    const rowRange: Range = { min: 0, max: 127 };
    d[0].forEach(s => {
      const half = Math.floor((rowRange.max - rowRange.min) / 2);
      if (s === 'B') {
        rowRange.min = rowRange.min + half + 1;
      } else {
        rowRange.max = rowRange.min + half;
      }
    });
    const colRange: Range = { min: 0, max: 7 };
    d[1].forEach(s => {
      const half = Math.floor((colRange.max - colRange.min) / 2);
      if (s === 'R') {
        colRange.min = colRange.min + half + 1;
      } else {
        colRange.max = colRange.min + half;
      }
    });

    seats.push({
      row: rowRange.min,
      column: colRange.min,
      id: rowRange.min * 8 + colRange.min
    });
  });
  console.log('5.1', seats.reduce((prev, cur) => cur.id > prev ? cur.id : prev, 0));

  const seatIds = seats.map(s => s.id);
  const allSeatIds = [...new Array(127 * 8 + 7).keys()];
  const missing: number[] = allSeatIds.filter(id => !seatIds.includes(id));
  const result = missing.filter(id => seatIds.includes(id + 1) && seatIds.includes(id - 1));
  console.assert(result.length === 1);
  console.log('5.2', result[0]);
});
