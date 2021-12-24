((): void => {
  enum AP {
    A,
    B,
    C,
    D,
  }

  type Space = AP | null;
  type Room = [Space, Space, Space, Space];
  type Rooms = [Room, Room, Room, Room];
  type Hall = Space[];
  type Burrow = { rooms: Rooms; hall: Hall };
  type State = { burrow: Burrow; cost: number };

  const { A, B, C, D } = AP;
  const ALLOWED = [0, 1, 3, 5, 7, 9, 10];
  const ALLOWED_SET = new Set(ALLOWED);
  const COST: Record<AP, number> = [1, 10, 100, 1000];
  const ROOM_X: Record<AP, number> = [2, 4, 6, 8];

  const copyBurrow = ({ hall, rooms }: Burrow): Burrow => ({
    hall: [...hall],
    rooms: [...(rooms.map((room: Room): Room => [...room]) as Rooms)],
  });

  const hashSpace = (space: Space): string =>
    typeof space === 'number' ? space.toString() : '.';

  const hashBurrow = ({ hall, rooms: [a, b, c, d] }: Burrow): string =>
    [...hall, ...a, ...b, ...c, ...d].map(hashSpace).join('');

  const r2r = (a: Burrow, i: number, from: number, to: number): State => {
    const b = copyBurrow(a);
    const ap = a.rooms[i]![from]!;
    b.rooms[i]![to] = ap;
    b.rooms[i]![from] = null;
    return { burrow: b, cost: Math.max(from, to) * COST[ap] };
  };

  const r2h = (a: Burrow, room: number, hall: number): Burrow => {
    const b = copyBurrow(a);
    b.hall[hall] = a.rooms[room]![0];
    b.rooms[room]![0] = null;
    return b;
  };

  const isEmpty = (s: Space): boolean => s === null;

  function* go(a: Burrow): Generator<State> {
    for (let i = 0; i <= 3; i += 1) {
      const room = a.rooms[i]!;
      const [top, ...bot] = room;
      let y = 3;
      let done = true;

      bot.forEach((s: Space, j: number): void => {
        if (s !== null) {
          if (y === 3) y = j;
          if (s !== i) done = false;
        }
      });

      if (top === i && y !== 0 && done) return yield r2r(a, i, 0, y);
      if (top === null && y !== 3 && !done) return yield r2r(a, i, y + 1, 0);
    }

    for (let x0 = 0; x0 <= 10; x0 += 1) {
      const i = a.hall[x0]!;

      if (i !== null && a.rooms[i][0] === null) {
        const spaces: Space[] = [];
        const x1 = ROOM_X[i];
        const ltr = x0 < x1;
        const r = ltr ? x1 : x0 - 1;

        for (let i = ltr ? x0 + 1 : x1; i <= r; i += 1)
          if (ALLOWED_SET.has(i)) spaces.push(a.hall[i]!);

        if (spaces.every(isEmpty)) {
          const burrow = copyBurrow(a);
          burrow.rooms[i]![0] = a.hall[x0]!;
          burrow.hall[x0] = null;
          return yield {
            burrow,
            cost: (Math.abs(x0 - x1) + 1) * COST[i as AP],
          };
        }
      }
    }

    for (let i = 0; i <= 3; i += 1) {
      const [top, ...bot] = a.rooms[i]!;
      const botValid = bot.every((s: Space): boolean => s === i || s === null);

      if (typeof top === 'number' && (top !== i || !botValid)) {
        const x0 = ROOM_X[i as AP];
        const l = ALLOWED.filter((x: number): boolean => x < x0).reverse();
        const r = ALLOWED.filter((x: number): boolean => x > x0);

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

  const init = {
    burrow: {
      rooms: [
        [A, D, D, B],
        [C, C, B, A],
        [B, B, A, D],
        [D, A, C, C],
      ],
      hall: new Array(11).fill(null) as Hall,
    } as Burrow,
    cost: 0,
  };

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

      if (cache.has(nextK) && cache.get(nextK)!.cost <= newCost) continue;

      cache.set(nextK, { burrow: next.burrow, cost: newCost });
      queue.push(nextK);
    }
  }

  console.log(cache.get('...........0000111122223333')?.cost);
})();
