export enum AP {
  A,
  B,
  C,
  D,
}

export type Space = AP | null;
export type Room = [Space, Space, Space, Space];
export type Rooms = [Room, Room, Room, Room];
export type Hall = Space[];
export type Burrow = { rooms: Rooms; hall: Hall };

export const { A, B, C, D } = AP;
export const allowed = [0, 1, 3, 5, 7, 9, 10];
export const allowedSet = new Set(allowed);

export const COST: Record<AP, number> = {
  [A]: 1,
  [B]: 10,
  [C]: 100,
  [D]: 1000,
};

export const roomX: Record<AP, number> = { [A]: 2, [B]: 4, [C]: 6, [D]: 8 };

export const copyBurrow = ({ hall, rooms }: Burrow): Burrow => ({
  hall: [...hall],
  rooms: [...(rooms.map((room: Room): Room => [...room]) as Rooms)],
});

export const hashSpace = (space: Space): string =>
  typeof space === 'number' ? space.toString() : '.';

export const hashBurrow = ({ hall, rooms: [a, b, c, d] }: Burrow): string =>
  [
    ...hall.map(hashSpace),
    ...a.map(hashSpace),
    ...b.map(hashSpace),
    ...c.map(hashSpace),
    ...d.map(hashSpace),
  ].join('');

export const r2r = (a: Burrow, i: number, from: number, to: number): Burrow => {
  const b = copyBurrow(a);
  b.rooms[i]![to] = a.rooms[i]![from]!;
  b.rooms[i]![from] = null;
  return b;
};

export const r2h = (a: Burrow, room: number, hall: number): Burrow => {
  const b = copyBurrow(a);
  b.hall[hall] = a.rooms[room]![0];
  b.rooms[room]![0] = null;
  return b;
};

export const h2r = (a: Burrow, hall: number, room: number): Burrow => {
  const b = copyBurrow(a);
  b.rooms[room]![0] = a.hall[hall]!;
  b.hall[hall] = null;
  return b;
};

const isEmpty = (s: Space): boolean => s === null;
const notEmpty = (s: Space): boolean => s !== null;

function* go(a: Burrow): Generator<{ burrow: Burrow; cost: number }> {
  for (let i = 0; i <= 3; i += 1) {
    const room = a.rooms[i]!;
    const bot = room.slice(1);

    if (
      room[0] === i &&
      bot.some(isEmpty) &&
      bot.every((s: Space): boolean => s === i || s === null)
    ) {
      const yRaw = bot.findIndex(notEmpty);
      const y = yRaw === -1 ? 3 : yRaw;
      return yield { burrow: r2r(a, i, 0, y), cost: y * COST[i as AP] };
    }
  }

  for (let i = 0; i <= 3; i += 1) {
    const room = a.rooms[i]!;
    const bot = room.slice(1);

    if (
      room[0] === null &&
      bot.some(notEmpty) &&
      bot.some((s: Space): boolean => s !== i && s !== null)
    ) {
      const y = bot.findIndex(notEmpty) + 1;
      const ap = room[y]!;
      return yield { burrow: r2r(a, i, y, 0), cost: y * COST[ap] };
    }
  }

  for (let x0 = 0; x0 <= 10; x0 += 1) {
    const i = a.hall[x0]!;

    if (i !== null && a.rooms[i][0] === null) {
      const spaces: Space[] = [];
      const x1 = roomX[i];
      const ltr = x0 < x1;
      const r = ltr ? x1 : x0 - 1;

      for (let i = ltr ? x0 + 1 : x1; i <= r; i += 1)
        if (allowedSet.has(i)) spaces.push(a.hall[i]!);

      if (spaces.every(isEmpty)) {
        return yield {
          burrow: h2r(a, x0, i),
          cost: (Math.abs(x0 - x1) + 1) * COST[i as AP],
        };
      }
    }
  }

  for (let i = 0; i <= 3; i += 1) {
    const room = a.rooms[i]!;
    const top = room[0];
    const bot = room.slice(1);
    const botValid = bot.every((s: Space): boolean => s === i || s === null);

    if (typeof top === 'number' && (top !== i || !botValid)) {
      const x0 = roomX[i as AP];
      const l = allowed.filter((x: number): boolean => x < x0).reverse();
      const r = allowed.filter((x: number): boolean => x > x0);

      for (
        let j = 0, x = l[j]!;
        j < l.length && a.hall[x] === null;
        j += 1, x = l[j]!
      ) {
        yield {
          burrow: r2h(a, i, x),
          cost: (Math.abs(x0 - x) + 1) * COST[top as AP],
        };
      }

      for (
        let j = 0, x = r[j]!;
        j < r.length && a.hall[x] === null;
        j += 1, x = r[j]!
      ) {
        yield {
          burrow: r2h(a, i, x),
          cost: (Math.abs(x0 - x) + 1) * COST[top as AP],
        };
      }
    }
  }
}

interface State {
  burrow: Burrow;
  cost: number;
}

export const initBurrow = (): Burrow => ({
  rooms: [
    [A, D, D, B],
    [C, C, B, A],
    [B, B, A, D],
    [D, A, C, C],
  ],

  hall: new Array(11).fill(null) as Hall,
});

((): void => {
  const init = { burrow: initBurrow(), cost: 0 };
  const initKey = hashBurrow(init.burrow);
  const cache = new Map<string, State>([[initKey, init]]);
  const queue: string[] = [initKey];

  while (queue.length > 0) {
    const k = queue.shift()!;
    const { burrow, cost } = cache.get(k)!;
    const iter = go(burrow);
    let curr = iter.next();

    while (!curr.done) {
      const next = curr.value;
      const nextK = hashBurrow(next.burrow);
      const newCost = cost + next.cost;
      curr = iter.next();

      if (cache.has(nextK) && cache.get(nextK)!.cost <= newCost) {
        continue;
      } else {
        cache.set(nextK, { burrow: next.burrow, cost: newCost });
        queue.push(nextK);
      }
    }
  }

  console.log(cache.get('...........0000111122223333')?.cost);
})();
