import { SmoothGraphics } from "@pixi/graphics-smooth";
import ECSComponent from "../EntityComponentSystem/Component";

export default class PixiGraphicsRenderComponent extends ECSComponent {
  pixiGraphics: SmoothGraphics;

  constructor(graphics: SmoothGraphics) {
    super();
    this.pixiGraphics = graphics;
  }
}
