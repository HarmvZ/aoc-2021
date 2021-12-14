import { readInput } from './../utils';

readInput(14, 2020).then((input: string) => {
//   input = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
// mem[8] = 11
// mem[7] = 101
// mem[8] = 0`;
//   input = `mask = 000000000000000000000000000000X1001X
// mem[42] = 100
// mask = 00000000000000000000000000000000X0XX
// mem[26] = 1`;

  type Instruction = {
    key: string;
    value: string | number;
  }
  const instructions = input.split('\n').map(l => {
    const i = l.trim().split(' = ');
    return { key: i[0], value: i[0] === 'mask' ? i[1] : parseInt(i[1]) };
  });

  let mask: string | null = null;
  const mems: number[] = [];
  for (const instr of instructions) {
    if (instr.key === 'mask') {
      mask = instr.value as string;
      continue;
    }
    console.assert(mask !== null, 'mask is not defined');
    const binaryValue = instr.value.toString(2).padStart(36, '0');
    const maskedVal = [...binaryValue.split('').entries()].map(([i, v]) => mask[i] !== 'X' ? mask[i] : v).join('');
    const memAddr = parseInt(instr.key.substring(4, instr.key.length - 1));
    mems[memAddr] = parseInt(maskedVal, 2);
  }
  console.log('14.1', mems.reduce((prev, cur) => prev + cur, 0));

  mask = null;
  const memsMap: Map<number, number> = new Map();
  for (const instr of instructions) {
    if (instr.key === 'mask') {
      mask = instr.value as string;
      continue;
    }
    console.assert(mask !== null, 'mask is not defined');
    const memAddr = parseInt(instr.key.substring(4, instr.key.length - 1)).toString(2).padStart(36, '0');
    const maskedAddrArr = [...memAddr.split('').entries()].map(([i, v]) => mask[i] === '0' ? v : mask[i]);
    let addresses: string[][] = [[]];
    for (const [i, c] of maskedAddrArr.entries()) {
      if (c === 'X') {
        addresses = [...addresses.map(a => [...a, '1']), ...addresses.map(a => [...a, '0'])];
      } else {
        addresses = addresses.map(a => [...a, c]);
      }
    }
    addresses.map(a => parseInt(a.join(''), 2)).forEach(a => {
      memsMap.set(a, instr.value as number);
    });
  }
  console.log('14.2', [...memsMap.values()].reduce(
    (prev, cur) => prev + cur, 0)
  );
});
