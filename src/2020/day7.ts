import { filterDistinct, readInput } from './../utils';

readInput(7, 2020).then((input: string) => {
//   input = `light red bags contain 1 bright white bag, 2 muted yellow bags.
// dark orange bags contain 3 bright white bags, 4 muted yellow bags.
// bright white bags contain 1 shiny gold bag.
// muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
// shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
// dark olive bags contain 3 faded blue bags, 4 dotted black bags.
// vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
// faded blue bags contain no other bags.
// dotted black bags contain no other bags.`;

//   input = `shiny gold bags contain 2 dark red bags.
// dark red bags contain 2 dark orange bags.
// dark orange bags contain 2 dark yellow bags.
// dark yellow bags contain 2 dark green bags.
// dark green bags contain 2 dark blue bags.
// dark blue bags contain 2 dark violet bags.
// dark violet bags contain no other bags.`

  type Contains = {
    amount: number;
    bag: string;
  }

  const bags: Map<string, Contains[]> = new Map();
  input.split('\n').forEach(r => {
    const [color, contains] = r.split(' bags contain ');
    const containRules = contains.split(/(,|\.)/).map(c => c.trim()).filter(
      c => !['', 'no other bags', ',', '.'].includes(c)
    ).map(c => c.split(' '));
    bags.set(color, containRules.map(r => ({
      amount: parseInt(r[0]),
      bag: r[1] + ' ' + r[2]
    })));
  });

  const findParents = (bag: string): string[] => {
    const parents = [...bags.entries()]
      .filter(([b, c]) => c.filter(cc => cc.bag === bag).length > 0)
      .map(([b, c]) => b);
    const recursiveParents: string[] = [];
    parents.forEach(p => { 
      recursiveParents.push(...findParents(p))
    });
    return filterDistinct([...parents, ...recursiveParents]);
  };
  const parents = findParents('shiny gold');
  console.log('7.1', parents.length);

  const countChildren = (bag: string): number => {
    return bags.get(bag).reduce(
      (prev, cur) => prev + cur.amount * countChildren(cur.bag) + cur.amount
    , 0);
  };
  console.log('7.2', countChildren('shiny gold'));
});
