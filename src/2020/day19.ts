import { create2DArray, create3DVolume, readInput } from './../utils';

readInput(19, 2020).then((input: string) => {
//   input = `0: 4 1 5
// 1: 2 3 | 3 2
// 2: 4 4 | 5 5
// 3: 4 5 | 5 4
// 4: "a"
// 5: "b"

  //   ababbb
  //   bababa
  //   abbbab
  //   aaabbb
  //   aaaabbb`;

  const [ruleArr, messages]: string[][] = input.split('\n\n').map(e => e.trim().split('\n').map(l => l.trim()));

  const rules: Map<number, string> = new Map(ruleArr.map(r => {
    const ru = r.split(': ');
    return [parseInt(ru[0]), ru[1]];
  }));

  const generateValidOptions = (rule: string, options: string[]): string[] => {
    if (rule.indexOf('"') !== -1) {
      options = options.map(o => o + rule[1]);
    } else if (rule.includes('|')) {
      options = rule.split(' | ').map(r => generateValidOptions(r, options)).flat();
    } else if (rule.includes(' ')) {
      rule.split(' ').forEach(r => {
        options = generateValidOptions(rules.get(parseInt(r)), options);
      });
    }
    return options;
  };

  const valid = generateValidOptions(rules.get(0), ['']);
  console.log(valid);
  let matches = 0;
  messages.forEach(m => {
    const partialMatch = valid.some(o => m.substring(0, o.length) === o);
    matches += partialMatch ? 1 : 0;
  });

  for (const m of messages) {

  }
  console.log('18.2', matches);
});
