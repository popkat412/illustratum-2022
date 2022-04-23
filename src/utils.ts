export function randFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randInt(min: number, max: number) {
  return Math.round(randFloat(min, max));
}
