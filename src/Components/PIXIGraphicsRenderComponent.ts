import Component from "../EntitySystem/Component";
import * as PIXI from "pixi.js";

export default class PixiGraphicsRenderComponent extends Component {
  pixiGraphics: PIXI.Graphics;

  constructor(graphics: PIXI.Graphics) {
    super();
    this.pixiGraphics = graphics;
  }
}
