import { readInput } from './../utils';

readInput(12, 2020).then((input: string) => {
//   input = `F10
// N3
// F7
// R90
// F11`;

  type Instruction = {
    action: string;
    value: number;
  };
  const instructions: Instruction[] = input.split('\n').map(l => l.trim()).map(d => ({ action: d.substring(0, 1), value: parseInt(d.substring(1)) }));

  type Position = {
    x: number;
    y: number;
  };
  type ShipPosition = {
    x: number;
    y: number;
    direction: number;
  }

  const shipPos: ShipPosition = {
    x: 0,
    y: 0,
    direction: 0
  };
  for (const inst of instructions) {
    switch (inst.action) {
      case 'N':
        shipPos.y += inst.value;
        break;
      case 'S':
        shipPos.y -= inst.value;
        break;
      case 'E':
        shipPos.x += inst.value;
        break;
      case 'W':
        shipPos.x -= inst.value;
        break;
      case 'L':
        shipPos.direction += inst.value;
        shipPos.direction %= 360;
        break;
      case 'R':
        shipPos.direction -= inst.value;
        while (shipPos.direction < 0) {
          shipPos.direction += 360;
        }
        break;
      case 'F':
        switch (shipPos.direction) {
          case 0:
            shipPos.x += inst.value;
            break;
          case 90:
            shipPos.y += inst.value;
            break;
          case 180:
            shipPos.x -= inst.value;
            break;
          case 270:
            shipPos.y -= inst.value;
            break;
          default:
            console.error('nonexistant direction', shipPos.direction);
            break;
        }
        break;
    }
  }

  const manhattanDistance = (shipPos: ShipPosition | Position): number => {
    return Math.abs(shipPos.x) + Math.abs(shipPos.y);
  };

  console.log('12.1', manhattanDistance(shipPos));

  const waypoint: Position = {
    x: 10,
    y: 1
  };
  const shipPos1: Position = {
    x: 0,
    y: 0
  };

  for (const inst of instructions) {
    let rotate = 0;
    switch (inst.action) {
      case 'N':
        waypoint.y += inst.value;
        break;
      case 'S':
        waypoint.y -= inst.value;
        break;
      case 'E':
        waypoint.x += inst.value;
        break;
      case 'W':
        waypoint.x -= inst.value;
        break;
      case 'L':

        rotate += inst.value;
        rotate %= 360;
        break;
      case 'R':
        rotate -= inst.value;
        while (rotate < 0) {
          rotate += 360;
        }
        break;
      case 'F':
        shipPos1.x += waypoint.x * inst.value;
        shipPos1.y += waypoint.y * inst.value;
        break;
    }
    if (['L', 'R'].includes(inst.action)) {
      const waypointCopy: Position = { x: waypoint.x, y: waypoint.y };
      switch (rotate) {
        case 0:
          break;
        case 90:
          waypointCopy.x = -waypoint.y;
          waypointCopy.y = waypoint.x;
          break;
        case 180:
          waypointCopy.x = -waypoint.x;
          waypointCopy.y = -waypoint.y;
          break;
        case 270:
          waypointCopy.x = waypoint.y;
          waypointCopy.y = -waypoint.x;
          break;
        default:
          console.error('nonexistant direction', rotate);
          break;
      }
      waypoint.x = waypointCopy.x;
      waypoint.y = waypointCopy.y;
    }
  }
  console.log('12.2', manhattanDistance(shipPos1));
});
