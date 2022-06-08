import ParticleComponent from "./Components/ParticleComponent";
import * as PIXI from "pixi.js";
import PixiContainerComponent from "./Components/PIXIContainerComponent";

export function randFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randInt(min: number, max: number) {
  return Math.round(randFloat(min, max));
}

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

// https://stackoverflow.com/a/141943/13181476
export function lightenHexColor(color: number, strength: number): number {
  const originalColor = PIXI.utils.hex2rgb(color) as [number, number, number];
  const [r, g, b] = originalColor.map((v) => v * (1 + strength));

  const threshold = 0.999;
  const max = Math.max(r, g, b);
  if (max <= threshold) {
    return PIXI.utils.rgb2hex(originalColor);
  }
  const total = r + g + b;
  if (total >= threshold * 3) {
    return PIXI.utils.rgb2hex([threshold, threshold, threshold]);
  }
  const x = (3 * threshold - total) / (3 * max - total);
  const gray = threshold - x * max;
  return PIXI.utils.rgb2hex([gray + x * r, gray + x * g, gray + x * b]);
}

export function updatePixiContainer(
  pixiContainerComponent: PixiContainerComponent,
  particleComponent: ParticleComponent,
  scaleFactor: number
) {
  pixiContainerComponent.container.x = particleComponent.pos.x * scaleFactor;
  pixiContainerComponent.container.y = particleComponent.pos.y * scaleFactor;
}

export function updateParticleComponent(
  pixiContainerComponent: PixiContainerComponent,
  particleComponent: ParticleComponent,
  scaleFactor: number
) {
  particleComponent.pos.x = pixiContainerComponent.container.x / scaleFactor;
  particleComponent.pos.y = pixiContainerComponent.container.y / scaleFactor;
}

export function clampRange(x: number, low: number, high: number): number {
  return Math.max(Math.min(x, high), low);
}

// https://github.com/processing/p5.js/blob/v1.4.1/src/math/calculation.js#L409
export function mapRange(
  x: number,
  s1: number,
  e1: number,
  s2: number,
  e2: number,
  clamp = false
): number {
  const newx = ((x - s1) / (e1 - s1)) * (e2 - s2) + s2;
  if (!clamp) return newx;
  if (s2 < e2) {
    return clampRange(newx, s2, e2);
  } else {
    return clampRange(newx, e2, s2);
  }
}

export function sgn(x: number): number {
  if (x > 0) return 1;
  if (x < 0) return -1;
  return 0;
}

// adapted from https://gist.github.com/nikolas/b0cce2261f1382159b507dd492e1ceef
export function lerpColor(a: number, b: number, amt: number): number {
  const ar = a >> 16,
    ag = (a >> 8) & 0xff,
    ab = a & 0xff;
  const br = b >> 16,
    bg = (b >> 8) & 0xff,
    bb = b & 0xff;
  const rr = ar + amt * (br - ar),
    rg = ag + amt * (bg - ag),
    rb = ab + amt * (bb - ab);

  return ((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0;
}

export function updateArrowGraphic(
  length: number,
  arrowGraphic: PIXI.Graphics,
  {
    arrowWidth,
    arrowheadWidth,
    arrowheadHeight,
    centre = "bottom",
  }: {
    arrowWidth: number;
    arrowheadWidth: number;
    arrowheadHeight: number;
    centre?: "bottom" | "middle";
  }
): void {
  const offset = centre == "bottom" ? 0 : -(length + arrowheadHeight);
  arrowGraphic.drawRect(-arrowWidth / 2, -length + offset, arrowWidth, length);
  arrowGraphic.drawPolygon([
    new PIXI.Point(-arrowheadWidth / 2, -length + offset),
    new PIXI.Point(arrowheadWidth / 2, -length + offset),
    new PIXI.Point(0, -length - arrowheadHeight + offset),
  ]);
}
