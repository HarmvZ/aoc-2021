import { readInput } from './../utils';

readInput(13, 2020).then((input: string) => {
//   input = `939
// 7,13,x,x,59,x,31,19`;
  // input = `
  // 17,x,13,19`;
  // input = `
  // 1789,37,47,1889`;
  // input = `
  // 67,7,x,59,61`;

  const [[departureTime, ..._], buses] = input.split('\n').map(l => l.trim().split(',').map(c => c === 'x' ? -1 : parseInt(c)));

  let waitMinutes = Infinity;
  let result = 0;
  for (const bus of buses.filter(b => b !== -1)) {
    if ((bus - (departureTime % bus)) < waitMinutes) {
      waitMinutes = bus - (departureTime % bus);
      result = (bus - departureTime % bus) * bus;
    }
  }
  console.log('13.1', result);

  const highest = Math.max(...buses);
  const highestI = buses.indexOf(highest);
  const start = 312640392339418;// 238316553742301;// 154525185236992;// 118230625536165;// 115504688000696;// 100007630000000;
  let match = 0;
  let i = Math.floor(start / highest) * highest - highestI;
  const busEntries = [...buses.entries()].filter(([i, b]) => b !== -1);
  while (match === 0) {
    if (busEntries.every(([j, bus]) => (i + j) % bus === 0)) {
      match = i;
    }
    i += highest;
  }
  console.log('13.2', match);// 100012807820628
});
