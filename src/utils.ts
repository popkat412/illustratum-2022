import ParticleComponent from "./Components/ParticleComponent";
import PixiGraphicsRenderComponent from "./Components/PIXIGraphicsRenderComponent";

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
