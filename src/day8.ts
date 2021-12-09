import { readInput, difference } from './utils';

readInput(8, 2021).then(input => {
//   input = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
// edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
// fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
// fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
// aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
// fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
// dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
// bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
// egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
// gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;// example input
  console.log(input);
  const displays = input.split('\n').map(l => l.split('|').map(s => s.trim().split(' ')));
  console.log(displays);
  let uniques = 0;
  displays.forEach(([_, out]) => {
    out.forEach(o => {
      uniques += [2, 4, 3, 7].includes(o.length) ? 1 : 0;
    });
  });
  console.log('8.1', uniques);// 284

  const all: Set<string> = new Set('abcdefg'.split(''));

  let resultSum = 0;
  displays.forEach(([usps, out]) => {
    const uspsSets = usps.map(u => new Set(u.split('')));
    const one = uspsSets.filter(u => u.size === 2)[0];
    const four = uspsSets.filter(u => u.size === 4)[0];
    const seven = uspsSets.filter(u => u.size === 3)[0];
    const eight = uspsSets.filter(u => u.size === 7)[0];

    const zeroOrNine = uspsSets.filter(u => u.size === 6 && u.has([...one][0]) && u.has([...one][1]));
    const six = uspsSets.filter(u => u.size === 6 && !zeroOrNine.includes(u))[0];
    const zero = zeroOrNine.filter(u => difference(u, four).size === 3)[0];
    const nine = zeroOrNine.filter(u => u !== zero)[0];
    const three = uspsSets.filter(u => u.size === 5 && difference(u, seven).size === 2)[0];
    const twoOrFive = uspsSets.filter(u => u.size === 5 && difference(u, seven).size === 3);
    const topRight = [...difference(all, six)][0];

    const two = twoOrFive.filter(u => u.has(topRight))[0];
    const five = twoOrFive.filter(u => !u.has(topRight))[0];
    const setMap = [zero, one, two, three, four, five, six, seven, eight, nine];

    const findMatch = (o: string) => {
      let matches: number[] = [];
      setMap.forEach((s, i) => {
        if (!o.split('').map(char => s.has(char)).includes(false)) {
          matches.push(i);
        }
      });
      matches = matches.filter(
        i => ![...setMap[i]].map((c: string) => o.includes(c)).includes(false)
      );
      return matches[0];
    };
    const d = parseInt(out.map(o => findMatch(o).toString()).join(''));
    resultSum += d;
  });
  console.log('8.2:', resultSum);
});
