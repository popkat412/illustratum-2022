import ParticleComponent from "./Components/ParticleComponent";
import PixiGraphicsRenderComponent from "./Components/PIXIGraphicsRenderComponent";
import * as PIXI from "pixi.js";

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

export function updateGraphicsComponent(
  pixiGraphicsComponent: PixiGraphicsRenderComponent,
  particleComponent: ParticleComponent,
  scaleFactor: number
) {
  pixiGraphicsComponent.pixiGraphics.x = particleComponent.pos.x * scaleFactor;
  pixiGraphicsComponent.pixiGraphics.y = particleComponent.pos.y * scaleFactor;
}

export function updateParticleComponent(
  pixiGraphicsComponent: PixiGraphicsRenderComponent,
  particleComponent: ParticleComponent,
  scaleFactor: number
) {
  particleComponent.pos.x = pixiGraphicsComponent.pixiGraphics.x / scaleFactor;
  particleComponent.pos.y = pixiGraphicsComponent.pixiGraphics.y / scaleFactor;
}
