import { create2DArray, readInput } from './utils';

readInput(18, 2021).then(input => {
  // input = `[[[[[9,8],1],2],3],4]
  // [7,[6,[5,[4,[3,2]]]]]
  // [[6,[5,[4,[3,2]]]],1]
  // [[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]
  // [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]
  // [[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]`;
//   input = `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
// [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
// [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
// [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
// [7,[5,[[3,8],[1,4]]]]
// [[2,[2,2]],[8,[8,1]]]
// [2,9]
// [1,[[[9,3],9],[[9,0],[0,7]]]]
// [[[5,[7,4]],7],1]
// [[[[4,2],2],6],[8,7]]`;
  // input = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
  // [[[5,[2,8]],4],[5,[[9,9],0]]]
  // [6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
  // [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
  // [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
  // [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
  // [[[[5,4],[7,7]],8],[[8,3],8]]
  // [[9,3],[[9,9],[6,[4,9]]]]
  // [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
  // [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;
  const inputStr = input.split('\n').map(l => l.trim());

  const increaseValStr = (inStr: string, increaseBy: number): string => {
    // increase value in string padded by [ and ]
    const intIndices = [];
    for (let s = 0; s < inStr.length; s++) {
      if (!['[', ']'].includes(inStr[s])) {
        intIndices.push(s);
      }
    }
    const start = Math.min(...intIndices);
    const end = Math.max(...intIndices) + 1;
    const val = parseInt(inStr.substring(start, end));
    return inStr.substring(0, start) + (val + increaseBy).toString() + inStr.substring(end);
  };

  const explode = (inputStr: string): string => {
    let depth = 0;
    const lastDigit: number | null = null;

    for (let i = 0; i < inputStr.length; i++) {
      const char = inputStr[i];
      if (char === '[') {
        depth += 1;
      }
      if (char === ']') {
        depth -= 1;
      }
      if (depth > 4) {
        const rightEndIndex = i + inputStr.substring(i).indexOf(']');
        const pair = inputStr.substring(i + 1, rightEndIndex);
        console.assert(pair.indexOf('[') === -1);
        const pairInts = pair.split(',').map(i => parseInt(i));

        const leftSplit = inputStr.substring(0, i).split(',');
        if (leftSplit.length > 1) {
          leftSplit[leftSplit.length - 2] = increaseValStr(leftSplit[leftSplit.length - 2], pairInts[0]);
        }
        const rightSplit = inputStr.substring(rightEndIndex + 1).split(',');
        if (rightSplit.length > 1) {
          rightSplit[1] = increaseValStr(rightSplit[1], pairInts[1]);
        }
        return leftSplit.join(',') + '0' + rightSplit.join(',');
      }
    }
    return inputStr;
  };

  const findFirstInt = (inputStr: string): [number, number] => {
    let intStart = -1;
    let length = 1;
    for (let i = 0; i < inputStr.length; i++) {
      if (!['[', ']', ','].includes(inputStr[i])) {
        if (intStart === -1) {
          intStart = i;
        } else {
          length += 1;
        }
      } else {
        if (intStart !== -1) {
          break;
        }
      }
    }
    return [intStart, length];
  };
  const split = (inputStr: string): string => {
    let i = 0;
    while (i < inputStr.length - 1) {
      const currentString = inputStr.substring(i);
      const [firstIntIndex, firstIntLength] = findFirstInt(currentString);
      if (firstIntIndex === -1) {
        break;
      }
      const intVal = parseInt(currentString.substring(firstIntIndex, firstIntIndex + firstIntLength));
      if (intVal > 9) {
        const newPair = [Math.floor(intVal / 2), Math.ceil(intVal / 2)];
        return inputStr.substring(0, i + firstIntIndex) + '[' + newPair.join(',') + ']' + currentString.substring(firstIntIndex + firstIntLength);
      }
      i = i + firstIntIndex + firstIntLength;
    }
    return inputStr;
  };

  // for (const inv of inputStr) {
  //   console.log(inv, explode(inv));
  // }

  const reduce = (inputStr: string): string => {
    let changed = true;
    while (changed) {
      const explodedStr = explode(inputStr);
      if (explodedStr === inputStr) {
        const splitStr = split(inputStr);
        if (splitStr === inputStr) {
          changed = false;
        } else {
          inputStr = splitStr;
        }
      } else {
        inputStr = explodedStr;
      }
    }
    return inputStr;
  };

  const sum = (inputStr: string[]): string => {
    let last = inputStr[0];
    for (let i = 1; i < inputStr.length; i++) {
      last = reduce('[' + last + ',' + inputStr[i] + ']');
    }
    return last;
  };

  const calculateMagnitude = (inputStr: string): number => {
    let currentString = inputStr;
    while (currentString.includes(']')) {
      for (let i = 0; i < inputStr.length; i++) {
        if (currentString[i] === ']') {
          let leftIndex = i;
          for (let j = i; j >= 0; j--) {
            if (currentString[j] === '[') {
              leftIndex = j;
              break;
            }
          }
          const pair = currentString.substring(leftIndex + 1, i).split(',').map(x => parseInt(x));
          const result = pair[0] * 3 + pair[1] * 2;
          currentString = currentString.substring(0, leftIndex) + result.toString() + currentString.substring(i + 1);
          break;
        }
      }
    }
    return parseInt(currentString);
  };

  console.log('18.1', calculateMagnitude(sum(inputStr)));

  let max = 0;
  for (const inStr of inputStr) {
    for (const inStr2 of inputStr) {
      if (inStr === inStr2) {
        continue;
      }
      max = Math.max(calculateMagnitude(reduce('[' + inStr + ',' + inStr2 + ']')), max);
    }
  }
  console.log('18.2', max);
});
