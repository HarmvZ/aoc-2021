import { readInput } from './../utils';

readInput(1, 2020).then(input => {
  //   input = `1721
  // 979
  // 366
  // 299
  // 675
  // 1456`;// example input
  //   console.log(input);
  const numbers = input.split('\n').map(n => parseInt(n));
  numbers.forEach(n1 => {
    numbers.forEach(n2 => {
      numbers.forEach(n3 => {
        if (n1 + n2 + n3 === 2020) {
          console.log('1.2', n1 * n2 * n3);
        }
      });
      if (n1 + n2 === 2020) {
        console.log('1.1', n1 * n2);
      }
    });
  });
});
