import { readInput } from './utils';

readInput(14, 2021).then(input => {
  // input = `NNCB

  // CH -> B
  // HH -> N
  // CB -> H
  // NH -> C
  // HB -> C
  // HC -> B
  // HN -> C
  // NN -> C
  // BH -> H
  // NC -> B
  // NB -> B
  // BN -> B
  // BB -> N
  // BC -> B
  // CC -> N
  // CN -> C`;// example input

  const [template, rules] = input.split('\n\n').map(l => l.trim());
  const insertionRules: Map<string, string> = new Map(rules.split('\n').map(l => l.trim().split(' -> ')).map(l => [l[0], l[1]]));

  const polymerize = (template: string, rules: typeof insertionRules): string => {
    let result = '';
    for (const [i, v] of template.split('').slice(0, -1).entries()) {
      const insert = rules.get(v + template[i + 1]);
      result += v + insert;
    }
    result += template[template.length - 1];
    return result;
  };

  let currentTemplate = template;
  for (let i = 0; i < 10; i++) {
    currentTemplate = polymerize(currentTemplate, insertionRules);
  }

  const countChars = (template: string): Map<string, number> => {
    const charCount: Map<string, number> = new Map();
    template.split('').forEach(c => {
      const last = charCount.has(c) ? charCount.get(c) : 0;
      charCount.set(c, last + 1);
    });
    return charCount;
  };
  const counts = countChars(currentTemplate);

  console.log('14.1', Math.max(...counts.values()) - Math.min(...counts.values()));

  let currentPairs: Map<string, number> = new Map();
  template.split('').slice(0, -1).map((c1, i) => c1 + template[i + 1]).forEach(pair => {
    const last = currentPairs.has(pair) ? currentPairs.get(pair) : 0;
    currentPairs.set(pair, last + 1);
  });

  let charCounts: Map<string, number> = countChars(template);

  const polymerizePairs = (pairs: typeof currentPairs, rules: typeof insertionRules, counts: typeof charCounts): [typeof currentPairs, typeof charCounts] => {
    const newPairs: typeof currentPairs = new Map();
    for (const [pair, count] of pairs.entries()) {
      const insert = rules.get(pair);

      newPairs.set(pair[0] + insert, newPairs.has(pair[0] + insert) ? newPairs.get(pair[0] + insert) + count : count);
      newPairs.set(insert + pair[1], newPairs.has(insert + pair[1]) ? newPairs.get(insert + pair[1]) + count : count);

      counts.set(insert, counts.has(insert) ? counts.get(insert) + count : count);
    }
    return [newPairs, counts];
  };

  for (let i = 0; i < 40; i++) {
    [currentPairs, charCounts] = polymerizePairs(currentPairs, insertionRules, charCounts);
  }

  console.log('14.2', Math.max(...charCounts.values()) - Math.min(...charCounts.values()));
});
