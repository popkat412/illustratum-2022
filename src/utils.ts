export function randFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randInt(min: number, max: number) {
  return Math.round(randFloat(min, max));
}

export function unzipList<T, U>(list: [T, U][]): [T[], U[]] {
  return [list.map((x) => x[0]), list.map((x) => x[1])];
}
