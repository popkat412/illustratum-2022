import { SmoothGraphics } from "@pixi/graphics-smooth";
import * as PIXI from "pixi.js";
import ECSComponent from "../EntityComponentSystem/Component";
import ECSEntity from "../EntityComponentSystem/Entity";

export class ShowDistanceData {
  target: ECSEntity;

  color: number;

  lineGraphic = new SmoothGraphics();
  pixiText = new PIXI.Text("");

  _setupDone = false;

  constructor(target: ECSEntity, color = 0xffffff) {
    this.target = target;
    this.color = color;
  }
}

export default class ShowDistanceComponent extends ECSComponent {
  // this isn't mutual, so you should only put it on one entity
  // to prevent duplicates
  showDistDataArr: ShowDistanceData[];

  constructor(showDistDataArr: ShowDistanceData[]) {
    super();
    this.showDistDataArr = showDistDataArr;
  }
}
