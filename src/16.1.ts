import { readFile } from 'fs/promises';

interface Header {
  version: number;
  typeId: number;
}

type Operator = Header & { packets: Packet[] };
type Literal = Header & { value: number };
type Packet = Literal | Operator;

interface ParseResult<T> {
  result: T;
  rem: string[];
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

const binaryToDecimal = (binary: string[]): number => {
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

const hexToBinary = (hex: string): string[] =>
  [...hex].reduce(
    (binary: string[], hexChar: string): string[] => [
      ...binary,
      ...hexCharToBits.get(hexChar)!,
    ],
    []
  );

const parseDecimal = (rem: string[], size: number): ParseResult<number> => ({
  result: binaryToDecimal(rem.slice(0, size)),
  rem: rem.slice(size),
});

const parseLiteral = (
  binary: string[],
  header: Header
): ParseResult<Literal> => {
  let bits: string[] = [];
  let rem = binary;
  let end = false;

  while (rem.length >= 5 && !end) {
    end = rem[0] === '0';
    bits = [...bits, ...rem.slice(1, 5)];
    rem = rem.slice(5);
  }

  return { result: { ...header, value: binaryToDecimal(bits) }, rem };
};

const parseOperator = (
  binary: string[],
  header: Header
): ParseResult<Operator> => {
  const packets: Packet[] = [];
  let rem = binary.slice(1);

  if (binary[0] === '0') {
    const length = parseDecimal(rem, 15);
    rem = length.rem.slice(0, length.result);

    while (rem.length > 0) {
      const packet = parse(rem);
      rem = packet.rem;

      packets.push(packet.result);
    }

    rem = length.rem.slice(length.result);
  } else {
    const number = parseDecimal(rem, 11);
    rem = number.rem;

    for (let i = 0; i < number.result; i += 1) {
      const packet = parse(rem);
      rem = packet.rem;

      packets.push(packet.result);
    }
  }

  return { result: { ...header, packets }, rem };
};

const parse = (rem: string[]): ParseResult<Packet> => {
  const { result: version, rem: versionRem } = parseDecimal(rem, 3);
  const { result: typeId, rem: headerRem } = parseDecimal(versionRem, 3);
  const header = { version, typeId };

  return typeId === 4
    ? parseLiteral(headerRem, header)
    : parseOperator(headerRem, header);
};

const sumVersions = (packet: Packet): number =>
  packet.typeId === 4
    ? packet.version
    : packet.version +
      (packet as Operator).packets.reduce(
        (sum: number, packet: Packet): number => sum + sumVersions(packet),
        0
      );

const solve = (input: string): number =>
  sumVersions(parse(hexToBinary(input.trim())).result);

(async (): Promise<void> => {
  const input = await readFile('./input/16', 'utf-8');

  console.log(solve(input));
})();
