import * as PIXI from "pixi.js";
import ParticleComponent from "../Components/ParticleComponent";
import TrailRenderComponent from "../Components/TrailRenderComponent";
import {
  HasPixiApp,
  HasRenderScale,
} from "../Environments/EnvironmentInterfaces";
import BaseCanvasSystem from "./BaseCanvasSystem";

export default class TrailRendererSystem<
  E extends HasPixiApp & HasRenderScale
> extends BaseCanvasSystem<E> {
  setup(): void {}

  update(_deltaTime: number): void {
    this.context.fillStyle = "#00000005";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const entities =
      this.entityManager.allEntitiesWithComponent<TrailRenderComponent>(
        TrailRenderComponent
      );
    for (const [entity, trailRendererComponent] of entities) {
      const particleComponent =
        this.entityManager.getComponent<ParticleComponent>(
          entity,
          ParticleComponent
        );
      if (!particleComponent || particleComponent.fixed) continue;

      const x = Math.round(
        particleComponent.pos.x * this.environment.scaleFactor
      );
      const y = Math.round(
        particleComponent.pos.y * this.environment.scaleFactor
      );

      const prevX = Math.round(
        particleComponent.prevPos.x * this.environment.scaleFactor
      );
      const prevY = Math.round(
        particleComponent.prevPos.y * this.environment.scaleFactor
      );

      this.context.beginPath();

      const colorStr = PIXI.utils.hex2string(trailRendererComponent.trailColor);
      this.context.strokeStyle = `${colorStr}80`; // basically adding 50% alpha
      this.context.lineWidth = 3;

      this.context.moveTo(prevX, prevY);
      this.context.lineTo(x, y);
      this.context.stroke();
    }

    this.texture.update();
  }
}
