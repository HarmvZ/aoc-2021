import { posix } from 'path/posix';
import { create2DArray, readInput } from './utils';

readInput(19, 2021).then(input => {
//   input = `--- scanner 0 ---
// 404,-588,-901
// 528,-643,409
// -838,591,734
// 390,-675,-793
// -537,-823,-458
// -485,-357,347
// -345,-311,381
// -661,-816,-575
// -876,649,763
// -618,-824,-621
// 553,345,-567
// 474,580,667
// -447,-329,318
// -584,868,-557
// 544,-627,-890
// 564,392,-477
// 455,729,728
// -892,524,684
// -689,845,-530
// 423,-701,434
// 7,-33,-71
// 630,319,-379
// 443,580,662
// -789,900,-551
// 459,-707,401

  //   --- scanner 1 ---
  //   686,422,578
  //   605,423,415
  //   515,917,-361
  //   -336,658,858
  //   95,138,22
  //   -476,619,847
  //   -340,-569,-846
  //   567,-361,727
  //   -460,603,-452
  //   669,-402,600
  //   729,430,532
  //   -500,-761,534
  //   -322,571,750
  //   -466,-666,-811
  //   -429,-592,574
  //   -355,545,-477
  //   703,-491,-529
  //   -328,-685,520
  //   413,935,-424
  //   -391,539,-444
  //   586,-435,557
  //   -364,-763,-893
  //   807,-499,-711
  //   755,-354,-619
  //   553,889,-390

  //   --- scanner 2 ---
  //   649,640,665
  //   682,-795,504
  //   -784,533,-524
  //   -644,584,-595
  //   -588,-843,648
  //   -30,6,44
  //   -674,560,763
  //   500,723,-460
  //   609,671,-379
  //   -555,-800,653
  //   -675,-892,-343
  //   697,-426,-610
  //   578,704,681
  //   493,664,-388
  //   -671,-858,530
  //   -667,343,800
  //   571,-461,-707
  //   -138,-166,112
  //   -889,563,-600
  //   646,-828,498
  //   640,759,510
  //   -630,509,768
  //   -681,-892,-333
  //   673,-379,-804
  //   -742,-814,-386
  //   577,-820,562

  //   --- scanner 3 ---
  //   -589,542,597
  //   605,-692,669
  //   -500,565,-823
  //   -660,373,557
  //   -458,-679,-417
  //   -488,449,543
  //   -626,468,-788
  //   338,-750,-386
  //   528,-832,-391
  //   562,-778,733
  //   -938,-730,414
  //   543,643,-506
  //   -524,371,-870
  //   407,773,750
  //   -104,29,83
  //   378,-903,-323
  //   -778,-728,485
  //   426,699,580
  //   -438,-605,-362
  //   -469,-447,-387
  //   509,732,623
  //   647,635,-688
  //   -868,-804,481
  //   614,-800,639
  //   595,780,-596

  //   --- scanner 4 ---
  //   727,592,562
  //   -293,-554,779
  //   441,611,-461
  //   -714,465,-776
  //   -743,427,-804
  //   -660,-479,-426
  //   832,-632,460
  //   927,-485,-438
  //   408,393,-506
  //   466,436,-512
  //   110,16,151
  //   -258,-428,682
  //   -393,719,612
  //   -211,-452,876
  //   808,-476,-593
  //   -575,615,604
  //   -485,667,467
  //   -680,325,-822
  //   -627,-443,-432
  //   872,-547,-609
  //   833,512,582
  //   807,604,487
  //   839,-516,451
  //   891,-625,532
  //   -652,-548,-490
  //   30,-46,-14`;
  const inputStr = input.split('\n\n').map(l => l.trim());

  type Pos = {
    x: number;
    y: number;
    z: number;
  }
  class Scanner {
      beacons: Pos[] = []
      id: number
      constructor (scannerStr: string) {
        const [idStr, ...beaconsStr] = scannerStr.split('\n');
        this.id = parseInt(idStr.replace('--- scanner ', '').replace(' ---', ''));
        this.beacons = beaconsStr.map(b => {
          const posStr = b.split(',').map(i => parseInt(i));
          return { x: posStr[0], y: posStr[1], z: posStr[2] };
        });
      }
  }
  const scanners = inputStr.map(scanStr => new Scanner(scanStr));

  const findMatchingBeacons = (beacons1: Pos[], beacons2: Pos[]): Pos[] => {
    const matchingBeacons = beacons1.filter(b => beacons2.find(b2 => b.x === b2.x && b.y === b2.y && b.z === b2.z));
    return matchingBeacons;
  };

  const ROT_MATRICES_3D = [
    [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    [[1, 0, 0], [0, -1, 0], [0, 0, -1]],
    [[1, 0, 0], [0, 0, -1], [0, 1, 0]],
    [[1, 0, 0], [0, 0, 1], [0, -1, 0]],

    [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    [[-1, 0, 0], [0, 1, 0], [0, 0, -1]],
    [[0, 0, 1], [0, 1, 0], [-1, 0, 0]],
    [[0, 0, -1], [0, 1, 0], [1, 0, 0]],

    [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    [[-1, 0, 0], [0, -1, 0], [0, 0, 1]],
    [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
    [[0, 1, 0], [-1, 0, 0], [0, 0, 1]],

  ];

  const ROTATION_MATRICES = [
    [[1, 0], [0, 1]],
    [[0, -1], [1, 0]],
    [[-1, 0], [0, -1]],
    [[0, 1], [-1, 0]],

    // [[0, 1], [1, 0]],
    // [[1, 0], [0, -1]],
    // [[0, -1], [-1, 0]],
    // [[-1, 0], [0, 1]]
  ];
  const AXES_ORDERS: (keyof Pos)[][] = [
    ['x', 'y', 'z'],
    ['y', 'z', 'x'],
    ['z', 'x', 'y'],

    // ['y', 'x', 'z'],
    // ['z', 'y', 'x'],
    // ['x', 'z', 'y'],
  ];

  const matches = [];
  let unmatchedScanners = scanners.slice();
  while (unmatchedScanners.length > 0) {
    console.log('roundtrip');
    // eslint-disable-next-line no-labels
    scanner2loop: {
      for (const scanner1 of unmatchedScanners) {
        for (const scanner2 of unmatchedScanners) {
          if (scanner1 === scanner2) {
            continue;
          }
          // if (matches.filter(m => (m[0] === scanner1 && m[1] === scanner2) || (m[1] === scanner1 && m[0] === scanner2)).length > 0) {
          //   continue;
          // }
          for (const axes of AXES_ORDERS) {
            for (const up of [1, -1]) {
              for (const rotation of ROTATION_MATRICES) {
                const rotatedBeacons = scanner2.beacons.map(b => {
                  const resultPos: Pos = { ...b };
                  resultPos[axes[0]] = b[axes[0]] * rotation[0][0] + b[axes[1]] * rotation[0][1];
                  resultPos[axes[1]] = b[axes[0]] * rotation[1][0] + b[axes[1]] * rotation[1][1];
                  resultPos[axes[0]] = resultPos[axes[0]];
                  resultPos[axes[1]] = resultPos[axes[1]];
                  resultPos[axes[2]] = up * resultPos[axes[2]];
                  return resultPos;
                });
                for (const pos of scanner1.beacons) {
                  const translatedBeacons = scanner1.beacons.map(
                    b => ({ x: b.x - pos.x, y: b.y - pos.y, z: b.z - pos.z }),
                  );
                  for (const pos2 of rotatedBeacons) {
                    const beacons = rotatedBeacons.map(
                      b => ({ x: b.x - pos2.x, y: b.y - pos2.y, z: b.z - pos2.z }),
                    );
                    const matchingBeacons = findMatchingBeacons(translatedBeacons, beacons);
                    if (matchingBeacons.length > 11) {
                      console.log('---MATCH---', scanner1.id, scanner2.id, matchingBeacons.length, axes, up);
                      const offsetPos: Pos = { x: pos.x - pos2.x, y: pos.y - pos2.y, z: pos.z - pos2.z };
                      matches.push([scanner1, scanner2, offsetPos, axes, up, rotation]);
                      unmatchedScanners = unmatchedScanners.filter(s => s !== scanner2);
                      const unmatchedBeacons = beacons.filter(b1 => !matchingBeacons.some(b2 => b1.x === b2.x && b2.y === b1.y && b1.z === b2.z));
                      scanner1.beacons.push(...unmatchedBeacons.map(
                        b => ({ x: b.x + offsetPos.x, y: b.y + offsetPos.y, z: b.z + offsetPos.z })),
                      );
                      // scanner1.beacons = scanner1.beacons.filter(b => scanner1.beacons.some(b2 => b.x === b2.x && b.y === b2.y && b.z === b2.z));
                      // TODO add other beacons to scanner2, rotated and translated back?
                      // TODO
                      // eslint-disable-next-line no-labels
                      break scanner2loop;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  console.log(matches);
});
