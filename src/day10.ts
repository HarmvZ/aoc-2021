import { readInput } from './utils';

readInput(10, 2021).then(input => {
//   input = `[({(<(())[]>[[{[]{<()<>>
// [(()[<>])]({[<{<<[]>>(
// {([(<{}[<>[]}>{[]{[(<()>
// (((({<>}<{<{<>}{[]{[]{}
// [[<[([]))<([[{}[[()]]]
// [{[{({}]{}}([{[{{{}}([]
// {<[[]]>}<{[{[{[]{()[[[]
// [<(<(<(<{}))><([]([]()
// <{([([[(<>()){}]>(<<{{
// <{([{{}}[<[[[<>{}]]]>[]]`;// example input
  // console.log(input);
  const lines = input.split('\n').map(l => l.trim().split(''));
  const brackets = [['{', '}'], ['[', ']'], ['(', ')'], ['<', '>']];
  const opening = brackets.map(b => b[0]);
  const closing = brackets.map(b => b[1]);
  const illegalChars: string[] = [];
  const autoCompleteScores: number[] = [];
  const autoCompleteScoreMap = new Map([
    ['(', 1],
    ['[', 2],
    ['{', 3],
    ['<', 4]
  ]);
  for (const line of lines) {
    const opened = [];
    let illegal = false;
    for (const char of line) {
      if (opening.includes(char)) {
        opened.push(char);
      } else {
        const expectedClosingIndex = opening.indexOf(opened[opened.length - 1]);
        if (expectedClosingIndex === -1) {
          throw Error('invalid character');
        }
        const expectedClosing = closing[expectedClosingIndex];
        if (expectedClosing === char) {
          opened.pop();
        } else {
          illegalChars.push(char);
          illegal = true;
          break;
        }
      }
    }
    if (opened.length > 0 && !illegal) {
      autoCompleteScores.push(opened.reverse().reduce((prev, cur) => prev * 5 + autoCompleteScoreMap.get(cur), 0));
    }
  }

  const scoreMap = new Map([
    [')', 3],
    [']', 57],
    ['}', 1197],
    ['>', 25137]
  ]);
  const score = illegalChars.reduce((prev, cur) => prev + scoreMap.get(cur), 0);
  console.log('10.1:', score);

  autoCompleteScores.sort((a, b) => a - b);
  console.log('10.2', autoCompleteScores[(autoCompleteScores.length - 1) / 2]);
});
