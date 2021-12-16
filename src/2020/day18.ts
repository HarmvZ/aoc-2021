import { create2DArray, create3DVolume, readInput } from './../utils';

readInput(18, 2020).then((input: string) => {
//   input = `1 + 2 * 3 + 4 * 5 + 6
// 1 + (2 * 3) + (4 * (5 + 6))
// 2 * 3 + (4 * 5)
// 5 + (8 * 3 + 9 + 3 * 4 * 3)
// 5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
// ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`;

  type Expression = string;
  const expressions: Expression[] = input.split('\n').map(e => e.trim().split(' ').join(''));

  const evaluate = (expr: Expression): number => {
    const getNextOperator = (expr: Expression): number => {
      const nextAdd = expr.indexOf('+') === -1 ? Infinity : expr.indexOf('+');
      const nextMul = expr.indexOf('*') === -1 ? Infinity : expr.indexOf('*');
      return Math.min(nextAdd, nextMul);
    };

    let nextOp = getNextOperator(expr);
    let ans = parseInt(expr.substring(0, nextOp));
    expr = expr.substring(nextOp);
    while (expr.length > 0) {
      const operator = expr[0];
      expr = expr.substring(1);
      nextOp = getNextOperator(expr);
      const operand = parseInt(expr.substring(0, nextOp));
      if (operator === '+') {
        ans += operand;
      } else {
        ans *= operand;
      }
      expr = expr.substring(nextOp);
    }
    return ans;
  };

  const evaluateWithPrecedence = (expr: Expression, evaluateExpression: Function) : number => {
    let finished = false;
    let currentExpression = expr;
    while (!finished) {
      const openedParenthesis: number[] = [];
      for (const [i, part] of currentExpression.split('').entries()) {
        if (part === '(') {
          openedParenthesis.push(i);
        }
        if (part === ')') {
          const startIndex = openedParenthesis[openedParenthesis.length - 1];
          const partExpression = currentExpression.substring(startIndex + 1, i);
          currentExpression = [
            currentExpression.substring(0, startIndex),
            evaluateExpression(partExpression).toString(),
            currentExpression.substring(i + 1)
          ].join('');
          break;
        }
      }
      if (!currentExpression.includes('(') && !currentExpression.includes(')')) {
        finished = true;
      }
    }
    return evaluateExpression(currentExpression);
  };

  const result = expressions.map(e => {
    const answer = evaluateWithPrecedence(e, evaluate);
    console.log(e, answer);
    return answer;
  }).reduce((p, c) => p + c, 0);
  console.log('18.1', result);

  const findNextOperator = (expr: Expression, start: number, next: boolean = true): number => {
    let i = next ? 1 : -1;
    let end = -1;
    while (end === -1) {
      if (['+', '*'].includes(expr[start + i]) || !expr[start + i]) {
        end = i;
      }
      i = next ? i + 1 : i - 1;
    }
    return end;
  };

  const evaluate2 = (expr: Expression): number => {
    // perform additions
    while (expr.indexOf('+') !== -1) {
      const index = expr.indexOf('+');
      const leftIndex = index + findNextOperator(expr, index, false) + 1;
      const rightIndex = index + findNextOperator(expr, index);
      const leftOperand = parseInt(expr.substring(leftIndex, index));
      const rightOperand = parseInt(expr.substring(index + 1, rightIndex));
      const result = leftOperand + rightOperand;
      expr = expr.substring(0, leftIndex) + result.toString() + expr.substring(rightIndex);
    }

    // perform multipications
    while (expr.indexOf('*') !== -1) {
      const index = expr.indexOf('*');
      const leftIndex = index + findNextOperator(expr, index, false) + 1;
      const rightIndex = index + findNextOperator(expr, index);
      const leftOperand = parseInt(expr.substring(leftIndex, index));
      const rightOperand = parseInt(expr.substring(index + 1, rightIndex));
      const result = leftOperand * rightOperand;
      expr = expr.substring(0, leftIndex) + result.toString() + expr.substring(rightIndex);
    }
    return parseInt(expr);
  };

  const result2 = expressions.map(e => {
    const answer = evaluateWithPrecedence(e, evaluate2);
    console.log(e, answer);
    return answer;
  }).reduce((p, c) => p + c, 0);
  console.log('18.2', result2);
});
