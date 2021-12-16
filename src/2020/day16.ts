import { readInput } from './../utils';

readInput(16, 2020).then((input: string) => {
//   input = `class: 1-3 or 5-7
// row: 6-11 or 33-44
// seat: 13-40 or 45-50

  // your ticket:
  // 7,1,14

  // nearby tickets:
  // 7,3,47
  // 40,4,50
  // 55,2,20
  // 38,6,12`;
  //   input = `class: 0-1 or 4-19
  // row: 0-5 or 8-19
  // seat: 0-13 or 16-19

  // your ticket:
  // 11,12,13

  // nearby tickets:
  // 3,9,18
  // 15,1,5
  // 5,14,9`;

  const [rulesArr, [_0, yourStr, ..._2], [_1, ...nearbyArr]] = input.split('\n\n').map(i => i.split('\n').map(l => l.trim()));

  type Range = {
    from: number;
    to: number;
  }
  type Rule = {
    name: string;
    ranges: Range[];
  }
  const rules: Rule[] = rulesArr.map(r => {
    const [name, rangesStr] = r.split(': ');
    const ranges = rangesStr.split(' or ').map(rs => rs.split('-').map(i => parseInt(i))).map(rs => ({ from: rs[0], to: rs[1] }));
    return { name, ranges };
  });

  const invalidValues: number[] = [];
  nearbyArr.forEach(ticket => {
    const vals = ticket.split(',').map(i => parseInt(i));
    vals.forEach(v => {
      if (!rules.some(rl => rl.ranges.some(ra => ra.from <= v && ra.to >= v))) {
        invalidValues.push(v);
      }
    });
  });
  console.log('16.1', invalidValues.reduce((prev, cur) => prev + cur, 0));

  const validNearby = nearbyArr.filter(ticket => {
    const vals = ticket.split(',').map(i => parseInt(i));
    return !vals.some(v => !rules.some(rl => rl.ranges.some(ra => ra.from <= v && ra.to >= v)));
  });

  const validNearbyArr = validNearby.map(t => t.split(',').map(i => parseInt(i)));

  const nameToIMap: Map<string, number[]> = new Map();
  for (const i of validNearbyArr[0].keys()) {
    const allValues = validNearbyArr.map(t => t[i]);
    for (const rule of rules) {
      if (allValues.every(v => rule.ranges.some(ra => ra.from <= v && ra.to >= v))) {
        nameToIMap.set(rule.name, nameToIMap.has(rule.name) ? [...nameToIMap.get(rule.name), i] : [i]);
      }
    }
  }
  const matched: number[] = [];
  while (matched.length < rules.length) {
    for (const [k, v] of nameToIMap) {
      if (v.length === 1) {
        if (matched.includes(v[0])) {
          continue;
        }
        for (const [k1, v1] of nameToIMap) {
          if (v1.length > 1) {
            nameToIMap.set(k1, v1.filter(v2 => v2 !== v[0]));
          }
        }
        matched.push(v[0]);
      }
    }
  }
  const yourTicket = yourStr.split(',').map(i => parseInt(i));

  const departureFields = [...nameToIMap.entries()].filter(([name, i]) => name.startsWith('departure'));
  console.assert(departureFields.length === 6);
  console.log('16.2', departureFields.reduce((prev, [_, i]) => prev * yourTicket[i[0]], 1));
});
