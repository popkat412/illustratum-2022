import ECSComponent from "../EntityComponentSystem/Component";
import * as PIXI from "pixi.js";
import Vec2 from "../Vec2";
import { InverseScalingFn, ScalingFn } from "../Utils/math";

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

  scalingFn: ScalingFn;
  inverseScalingFn: InverseScalingFn;

  constructor(
    id: string,
    label: string,
    units: string,
    color: number,
    scalingFn: ScalingFn,
    inverseScalingFn: InverseScalingFn
  ) {
    this.id = id;
    this.label = label;
    this.units = units;
    this.color = color;
    this.scalingFn = scalingFn;
    this.inverseScalingFn = inverseScalingFn;
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
