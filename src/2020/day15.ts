import { readInput } from './../utils';

readInput(15, 2020).then((input: string) => {
  // input = '3,1,2';
  // input = '0,3,6';

  const nrs = input.split(',').map(i => parseInt(i));
  const spoken: number[] = [];
  for (let i = 0; i < 2020; i++) {
    if (i < nrs.length) {
      spoken.push(nrs[i]);
    } else {
      const last = spoken[spoken.length - 1];
      const lastIndex = spoken.slice(0, -1).lastIndexOf(last);
      if (lastIndex !== -1) {
        spoken.push(spoken.length - lastIndex - 1);
      } else {
        spoken.push(0);
      }
    }
  }
  console.log('15.1', spoken[2019]);

  const spokenMap: Map<number, number> = new Map();
  const spoken1: number[] = [];
  let last = null;
  let nextLast = null;
  for (let i = 0; i < 30000000; i++) {
    if (nextLast !== null) {
      spokenMap.set(nextLast, i - 1);
    }
    nextLast = last;
    if (i < nrs.length) {
      last = nrs[i];
    } else {
      if (spokenMap.has(last)) {
        const lastIndex = spokenMap.get(last);
        last = i - lastIndex;
      } else {
        last = 0;
      }
    }
    if (i % 1000000 === 0) {
      console.log(i, spokenMap.size);
    }
  }
  console.log('15.1', last);
});
