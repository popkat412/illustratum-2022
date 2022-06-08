type Arr = readonly any[];
export function zipList<T extends Arr[]>(
  ...lists: T
): { [K in keyof T]: T[K] extends Arr ? T[K][number] : never }[];
export function zipList(...lists: Arr[]): any[] {
  const shortest = lists.reduce((acc, x) => (acc.length < x.length ? acc : x));
  return shortest.map((_, idx) => lists.map((a) => a[idx]));
}

export function unzipList<T, U>(list: [T, U][]): [T[], U[]] {
  return [list.map((x) => x[0]), list.map((x) => x[1])];
}

export function removeAllByValue<T>(list: T[], val: T): void {
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i] == val) {
      list.splice(i, 1);
    }
  }
}
