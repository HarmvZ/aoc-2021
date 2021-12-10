import { filterDistinct, readInput } from './../utils';

readInput(8, 2020).then((input: string) => {
//   input = `nop +0
// acc +1
// jmp +4
// acc +3
// jmp -3
// acc -99
// acc +1
// jmp -4
// acc +6`;

  type Operation = {
    arg: number;
    operation: string;
  }
  const operations: Operation[] = input.split('\n').map(o => ({
    arg: parseInt(o.split(' ')[1]),
    operation: o.split(' ')[0]
  }));

  type ProgramOutput = {
    acc: number;
    success: boolean;
  }
  const runProgram = (ops: Operation[]): ProgramOutput => {
    let acc = 0;
    let nextIndex = 0;
    const executed: number[] = [];
    while (nextIndex < ops.length) {
      if (executed.includes(nextIndex)) {
        // infinite loop reached
        return { acc, success: false };
      }
      executed.push(nextIndex);
      const nextOperation = ops[nextIndex];
      if (nextOperation.operation === 'jmp') {
        nextIndex += nextOperation.arg;
      } else if (nextOperation.operation === 'nop') {
        nextIndex += 1;
      } else if (nextOperation.operation === 'acc') {
        acc += nextOperation.arg;
        nextIndex += 1;
      }
    }
    return { acc, success: true };
  };
  // console.log('7.2', nextIndex);
  let output = runProgram(operations);
  console.log('8.1', output.acc);

  let success = false;
  let changedIndex = -1;
  while (!success) {
    const changedOperations = operations.slice();
    changedIndex = operations.findIndex((op, i) => i > changedIndex && ['nop', 'jmp'].includes(op.operation));
    changedOperations[changedIndex] = {
      arg: operations[changedIndex].arg,
      operation: operations[changedIndex].operation === 'nop' ? 'jmp' : 'nop'
    };
    output = runProgram(changedOperations);
    console.log(changedIndex, output);
    success = output.success;
  }
  console.log('8.2', output.acc);
});
