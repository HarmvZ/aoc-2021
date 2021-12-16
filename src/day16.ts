import { create2DArray, readInput } from './utils';

readInput(16, 2021).then(input => {
  // input = '38006F45291200';
  // input = 'EE00D40C823060';
  // input = '8A004A801A8002F478';
  // input = '620080001611562C8802118E34';
  // input = 'C0015000016115A2E0802F182340';
  // input = 'A0016C880162017C3686B18A3D4780';// example input

  // input = 'C200B40A82';
  // input = '04005AC33890';
  // input = 'CE00C43D881120';
  // input = 'D8005AC2A8F0';
  // input = 'F600BC2D8F';
  // input = '9C005AC2F8F0';
  // input = '9C0141080250320F1802104A08';
  const hexToBinaryString = (hex: string): string => {
    return hex.split('').map(
      hexChar => parseInt(hexChar, 16).toString(2).padStart(4, '0')
    ).join('');
  };

  const binaryData = hexToBinaryString(input.trim());

  type Packet = {
    id: number;
    version: number;
    typeId: number;
    value: number;
    subPacketIds: number[];
    subPackets: Packet[];
  };

  let id = 0;

  const readPacket = (binaryString: string): [Packet, string] => {
    const version = parseInt(binaryString.substring(0, 3), 2);
    const typeId = parseInt(binaryString.substring(3, 6), 2);
    let value: number | null = null;
    const subPacketIds: number[] = [];
    const subPackets: Packet[] = [];
    let remainingString = '';

    const addSubPackets = (packet: Packet) => {
      subPackets.push(packet);
      subPacketIds.push(packet.id);
    };

    if (typeId === 4) {
      let index = 6;
      let valueBinary = '';
      let finished = false;
      while (!finished) {
        valueBinary += binaryString.substring(index + 1, index + 5);
        if (binaryString[index] === '0') {
          finished = true;
        }
        index += 5;
      }
      value = parseInt(valueBinary, 2);
      remainingString = binaryString.substring(index);
    } else {
      if (binaryString[6] === '0') {
        const subPacketBitLength = parseInt(binaryString.substring(7, 22), 2);
        remainingString = binaryString.substring(22, 22 + subPacketBitLength);
        while (remainingString.length > 0) {
          const readPackets = readPacket(remainingString);
          addSubPackets(readPackets[0]);
          remainingString = readPackets[1];
        }
        remainingString = binaryString.substring(22 + subPacketBitLength);
      } else {
        let subPacketLength = parseInt(binaryString.substring(7, 18), 2);
        remainingString = binaryString.substring(18);
        while (subPacketLength > 0) {
          const readPackets = readPacket(remainingString);
          addSubPackets(readPackets[0]);
          remainingString = readPackets[1];
          subPacketLength -= 1;
        }
      }
    }
    const mainPacket = { id, version, typeId, value, subPacketIds, subPackets };
    id++;
    return [mainPacket, remainingString];
  };

  const [packet, remainingString] = readPacket(binaryData);
  const sumPacketVersions = (packet: Packet): number => {
    return packet.version + packet.subPackets.map(p => sumPacketVersions(p)).reduce((p, c) => p + c, 0);
  };
  const versionSum = sumPacketVersions(packet);

  console.log('16.1', versionSum);

  const getPacketValue = (packet: Packet): number => {
    const operation = typeIdToOperation.get(packet.typeId);
    if (packet.subPackets.length > 0) {
      return operation(packet.subPackets);
    } else {
      console.assert(packet.typeId === 4);
      return packet.value;
    }
  };

  const typeIdToOperation: Map<number, (packets: Packet[]) => number> = new Map([
    [0, p => p.reduce((prev, cur) => prev + getPacketValue(cur), 0)],
    [1, p => p.reduce((prev, cur) => prev * getPacketValue(cur), 1)],
    [2, p => Math.min(...p.map(packet => getPacketValue(packet)))],
    [3, p => Math.max(...p.map(packet => getPacketValue(packet)))],
    [5, p => getPacketValue(p[0]) > getPacketValue(p[1]) ? 1 : 0],
    [6, p => getPacketValue(p[0]) < getPacketValue(p[1]) ? 1 : 0],
    [7, p => getPacketValue(p[0]) === getPacketValue(p[1]) ? 1 : 0]
  ]);

  const result = getPacketValue(packet);
  console.log('16.2', result);
});
