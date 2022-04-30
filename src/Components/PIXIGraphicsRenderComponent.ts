import * as PIXI from "pixi.js";
import ECSComponent from "../EntityComponentSystem/Component";

export default class PixiGraphicsRenderComponent extends ECSComponent {
  pixiGraphics: PIXI.Graphics;

  constructor(graphics: PIXI.Graphics) {
    super();
    this.pixiGraphics = graphics;
  }
}
