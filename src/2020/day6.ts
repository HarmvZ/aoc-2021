import { readInput } from './../utils';

readInput(6, 2020).then((input: string) => {
  // input = `abc

  // a
  // b
  // c

  // ab
  // ac

  // a
  // a
  // a
  // a

  // b`;
  type Group = {
    nr: number;
    distinctAnswers: Set<string>;
    intersectAnswers: string[];
  }
  const answers: Group[] = input.split('\n\n').map(g => g.split('\n').map(l => l.trim())).map(g => {
    const distinctAnswers: Set<string> = new Set();
    g.reduce((prev, cur) => prev + cur, '').split('').forEach(a => distinctAnswers.add(a));
    const arrGroups = g.map(a => a.split(''));
    let intersectAnswers = arrGroups[0];
    intersectAnswers = intersectAnswers.filter(a => !arrGroups.map(p => p.includes(a)).includes(false));
    return { nr: g.length, distinctAnswers, intersectAnswers };
  });
  console.log('6.1', answers.reduce((prev, cur) => prev + cur.distinctAnswers.size, 0));
  console.log('6.2', answers.reduce((prev, cur) => prev + cur.intersectAnswers.length, 0));
});
