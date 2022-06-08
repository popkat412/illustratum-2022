import * as PIXI from "pixi.js";
import EntityManager from "../EntityComponentSystem/EntityManager";
import ECSSystem from "../EntityComponentSystem/System";
import { HasPixiApp } from "../Environments/EnvironmentInterfaces";

export default abstract class BaseCanvasSystem<
  E extends HasPixiApp
> extends ECSSystem<E> {
  protected canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;
  protected texture: PIXI.Texture;

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
    sprite.zIndex = -1;
    this.environment.app.stage.addChild(sprite);
  }

  abstract setup(): void;
  abstract update(deltaTime: number): void;
}
