import ECSComponent from "../EntityComponentSystem/Component";
import * as PIXI from "pixi.js";
import Vec2 from "../Vec2";

export class ShowVectorData {
  readonly id: string;
  // vector to be shown
  vec: Vec2 | null = null;
  // controlling how it should be displayed
  label: string;
  units: string;
  color: number;

  arrowGraphic = new PIXI.Graphics();
  pixiText = new PIXI.Text("");
  scalingFn: (mag: number) => number;

  constructor(
    id: string,
    label: string,
    units: string,
    color: number,
    scalingFn: (mag: number) => number
  ) {
    this.id = id;
    this.label = label;
    this.units = units;
    this.color = color;
    this.scalingFn = scalingFn;
  }
}

export default class ShowVectorComponent extends ECSComponent {
  readonly vectorDataArr: readonly ShowVectorData[];

  constructor(vectorDataArr: ShowVectorData[]) {
    super();
    this.vectorDataArr = Object.freeze(vectorDataArr);
  }

  getVectorData(id: string): ShowVectorData | null {
    for (const vectorData of this.vectorDataArr) {
      if (vectorData.id == id) return vectorData;
    }
    return null;
  }
}
