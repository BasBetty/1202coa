import { readFile } from 'fs/promises';

interface Header {
  version: number;
  typeId: number;
}

type Operator = Header & { packets: Packet[] };
type Literal = Header & { value: number };
type Packet = Literal | Operator;

interface State {
  input: string;
  pos: number;
}

const hexCharToBits = new Map([
  ['0', '0000'],
  ['1', '0001'],
  ['2', '0010'],
  ['3', '0011'],
  ['4', '0100'],
  ['5', '0101'],
  ['6', '0110'],
  ['7', '0111'],
  ['8', '1000'],
  ['9', '1001'],
  ['A', '1010'],
  ['B', '1011'],
  ['C', '1100'],
  ['D', '1101'],
  ['E', '1110'],
  ['F', '1111'],
]);

const binaryToDecimal = (binary: string): number => {
  let decimal = 0;
  let leading = true;

  for (let i = 0; i < binary.length; i += 1) {
    const bit = binary[i];
    const one = bit === '1';

    if (leading && one) leading = false;
    if (!leading) decimal += one ? 2 ** (binary.length - i - 1) : 0;
  }

  return decimal;
};

const hexToBinary = (hex: string): string =>
  [...hex].reduce(
    (binary: string, hexChar: string): string =>
      binary + hexCharToBits.get(hexChar)!,
    ''
  );

const parseDecimal = (state: State, size: number): number => {
  const decimal = binaryToDecimal(
    state.input.slice(state.pos, state.pos + size)
  );

  state.pos += size;
  return decimal;
};

const parseLiteral = (state: State, header: Header): Literal => {
  let bits: string = '';
  let last = false;

  while (!last) {
    last = state.input[state.pos] === '0';
    bits += state.input.slice(state.pos + 1, state.pos + 5);
    state.pos += 5;
  }

  return { ...header, value: binaryToDecimal(bits) };
};

const parseOperator = (state: State, header: Header): Operator => {
  const mode = state.input[state.pos];
  let packets: Packet[] = [];
  state.pos += 1;

  if (mode === '0') {
    const length = parseDecimal(state, 15);
    const start = state.pos;

    while (state.pos - start < length) packets.push(parse(state));
  } else {
    const number = parseDecimal(state, 11);

    for (let i = 0; i < number; i += 1) packets.push(parse(state));
  }

  return { ...header, packets };
};

const parse = (state: State): Packet => {
  const version = parseDecimal(state, 3);
  const typeId = parseDecimal(state, 3);

  return typeId === 4
    ? parseLiteral(state, { version, typeId })
    : parseOperator(state, { version, typeId });
};

const evaluate = (packet: Packet): number => {
  if (packet.typeId === 4) return (packet as Literal).value;

  const { typeId, packets } = packet as Operator;

  if (typeId === 0)
    return packets.reduce((a: number, p: Packet): number => a + evaluate(p), 0);

  if (typeId === 1)
    return packets.reduce((a: number, p: Packet): number => a * evaluate(p), 1);

  if (typeId === 2) return Math.min(...packets.map(evaluate));
  if (typeId === 3) return Math.max(...packets.map(evaluate));

  const a = evaluate(packets[0]!);
  const b = evaluate(packets[1]!);

  if (typeId === 5) return a > b ? 1 : 0;
  if (typeId === 6) return a < b ? 1 : 0;
  return a === b ? 1 : 0;
};

const solve = (input: string): number =>
  evaluate(parse({ input: hexToBinary(input.trim()), pos: 0 }));

(async (): Promise<void> => {
  const input = await readFile('./input/16', 'utf-8');

  const start = performance.now();
  const solution = solve(input);
  const end = performance.now();

  console.log(`(${end - start}ms) ${solution}`);
})();
