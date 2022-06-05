import ECSComponent from "../EntityComponentSystem/Component";
import * as PIXI from "pixi.js";
import Vec2 from "../Vec2";

export default class ShowVectorComponent extends ECSComponent {
  // vector to be shown
  vec: Vec2 | null = null;
  // controlling how it should be displayed
  label: string;
  units: string;
  color: number;

  arrowGraphic = new PIXI.Graphics();
  pixiText = new PIXI.Text("");

  constructor(label: string, units: string, color: number) {
    super();
    this.label = label;
    this.units = units;
    this.color = color;
  }
}
