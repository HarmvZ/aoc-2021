import { create3DVolume, readInput } from './utils';

readInput(22, 2021).then(input => {
  input = `on x=-20..26,y=-36..17,z=-47..7
on x=-20..33,y=-21..23,z=-26..28
on x=-22..28,y=-29..23,z=-38..16
on x=-46..7,y=-6..46,z=-50..-1
on x=-49..1,y=-3..46,z=-24..28
on x=2..47,y=-22..22,z=-23..27
on x=-27..23,y=-28..26,z=-21..29
on x=-39..5,y=-6..47,z=-3..44
on x=-30..21,y=-8..43,z=-13..34
on x=-22..26,y=-27..20,z=-29..19
off x=-48..-32,y=26..41,z=-47..-37
on x=-12..35,y=6..50,z=-50..-2
off x=-48..-32,y=-32..-16,z=-15..-5
on x=-18..26,y=-33..15,z=-7..46
off x=-40..-22,y=-38..-28,z=23..41
on x=-16..35,y=-41..10,z=-47..6
off x=-32..-23,y=11..30,z=-14..3
on x=-49..-5,y=-3..45,z=-29..18
off x=18..30,y=-20..-8,z=-3..13
on x=-41..9,y=-7..43,z=-33..15
on x=-54112..-39298,y=-85059..-49293,z=-27449..7877
on x=967..23432,y=45373..81175,z=27513..53682`;

  const reactor: boolean[][][] = create3DVolume(100, 100, 100, false);

  type Instruction = {
    on: boolean;
    xRange: [number, number];
    yRange: [number, number];
    zRange: [number, number];
  }
  const instructions: Instruction[] = input.split('\n').map(l => {
    const [onStr, ranges] = l.split(' ');
    const rangeArr = ranges.split(',').map(r => r.split('=')[1].split('..').map(i => parseInt(i)));
    return {
      on: onStr === 'on',
      xRange: rangeArr[0] as [number, number],
      yRange: rangeArr[1] as [number, number],
      zRange: rangeArr[2] as [number, number],
    };
  });

  type Pos3D = {
    x: number;
    y: number;
    z: number;
  }

  const range = (start: number, end: number): number[] => {
    return [...(new Array(end - start)).keys()].map(k => k + start);
  };

  type Range = {
    start: Pos3D;
    end: Pos3D;
  }
  const onRanges: Range[] = [];
  for (const instr of instructions) {
    console.log('Running instruction', instructions.indexOf(instr));
    const removeIndices = [];
    onRanges.forEach((r, i) => {
      const encapsulates = {
        x: instr.xRange[0] <= r.start.x && instr.xRange[1] >= r.end.x,
        y: instr.yRange[0] <= r.start.y && instr.yRange[1] >= r.end.y,
        z: instr.zRange[0] <= r.start.z && instr.zRange[1] >= r.end.z,
      };
      if (encapsulates.x && encapsulates.y && encapsulates.z) {
        removeIndices.push(i);
        // add current.
      }
      // todo
    });
  }
  console.log('22.1', '');
});
