import * as PIXI from "pixi.js";
import ParticleComponent from "../Components/ParticleComponent";
import TrailRenderComponent from "../Components/TrailRenderComponent";
import EntityManager from "../EntitySystem/EntityManager";
import System from "../EntitySystem/System";
import {
  HasPixiApp,
  HasRenderScale,
} from "../Environments/EnvironmentInterfaces";

export default class TrailRendererSystem<
  E extends HasPixiApp & HasRenderScale
> extends System<E> {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private texture: PIXI.Texture;

  constructor(entityManager: EntityManager, environment: E) {
    super(entityManager, environment);

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.environment.app.view.width;
    this.canvas.height = this.environment.app.view.height;

    this.context = this.canvas.getContext("2d")!;

    this.texture = PIXI.Texture.from(this.canvas);

    const sprite = new PIXI.Sprite(this.texture);
    sprite.width = this.environment.app.renderer.width;
    sprite.height = this.environment.app.renderer.height;
    this.environment.app.stage.addChild(sprite);
  }

  setup(): void {}

  update(_deltaTime: number): void {
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
