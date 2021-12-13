import { getIndices, readInput } from './utils';

readInput(12, 2021).then(input => {
//   input = `start-A
// start-b
// A-c
// A-b
// b-d
// A-end
// b-end`;// example input
//   input = `fs-end
//   he-DX
//   fs-he
//   start-DX
//   pj-DX
//   end-zg
//   zg-sl
//   zg-pj
//   pj-he
//   RW-he
//   fs-DX
//   pj-RW
//   zg-RW
//   start-pj
//   he-WI
//   zg-he
//   pj-fs
//   start-RW`;
  const connections: string[][] = input.split('\n').map(l => l.trim().split('-'));

  const nodeMap: Map<string, string[]> = new Map();
  for (const [from, to] of connections) {
    if (!nodeMap.has(from)) {
      nodeMap.set(from, [to]);
    } else {
      nodeMap.get(from).push(to);
    }
    if (!nodeMap.has(to)) {
      nodeMap.set(to, [from]);
    } else {
      nodeMap.get(to).push(from);
    }
  }

  const traverse = (map: typeof nodeMap, prevPath: string[]): string[][] => {
    const nextPaths: string[][] = map.get(prevPath[prevPath.length - 1]).map(n => [...prevPath, n]);
    const finishedPaths = nextPaths.filter(p => p[p.length - 1] === 'end');
    const unfinishedPaths = nextPaths.filter(p => {
      const last = p[p.length - 1];
      const isLowerCase = last.toLowerCase() === last;
      const alreadyVisited = prevPath.includes(last);
      return last !== 'end' && (!alreadyVisited || !isLowerCase);
    });
    const traversedUnfinishedPaths: string[][] = unfinishedPaths.reduce((prev, p) => [...prev, ...traverse(map, p)], [] as string[][]);
    return [
      ...finishedPaths,
      ...traversedUnfinishedPaths
    ];
  };

  const next = nodeMap.get('start');
  const paths = next.reduce((prev, n) => [...prev, ...traverse(nodeMap, ['start', n])], []);
  console.log('12.1', paths.length);

  const traverse2 = (map: typeof nodeMap, prevPath: string[]): string[][] => {
    const nextPaths: string[][] = map.get(prevPath[prevPath.length - 1]).filter(n => n !== 'start').map(n => [...prevPath, n]);
    const finishedPaths = nextPaths.filter(p => p[p.length - 1] === 'end');
    const hasDuplicateLowers = prevPath.filter(p => p === p.toLowerCase()).some((p, i, arr) => getIndices(arr, p).length > 1);
    const unfinishedPaths = nextPaths.filter(p => p[p.length - 1] !== 'end').filter(p => {
      const last = p[p.length - 1];
      const isLowerCase = last.toLowerCase() === last;
      const alreadyVisited = prevPath.includes(last);
      return (hasDuplicateLowers && (!alreadyVisited || !isLowerCase)) || !hasDuplicateLowers;
    });
    const traversedUnfinishedPaths: string[][] = unfinishedPaths.reduce((prev, p) => [...prev, ...traverse2(map, p)], [] as string[][]);
    return [
      ...finishedPaths,
      ...traversedUnfinishedPaths
    ];
  };

  const paths2 = next.reduce((prev, n) => [...prev, ...traverse2(nodeMap, ['start', n])], []);
  console.log('12.2', paths2.length);
});
