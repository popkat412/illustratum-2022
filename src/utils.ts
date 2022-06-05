import ParticleComponent from "./Components/ParticleComponent";
import * as PIXI from "pixi.js";
import PixiContainerComponent from "./Components/PIXIContainerComponent";

export function randFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randInt(min: number, max: number) {
  return Math.round(randFloat(min, max));
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
export function mapRange(x: number, s1: number, e1: number, s2: number, e2: number, clamp: boolean = false): number {
  const newx = (x - s1) / (e1 - s1) * (e2 - s2) + s2;
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
