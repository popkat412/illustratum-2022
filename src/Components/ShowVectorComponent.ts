import { SmoothGraphics } from "@pixi/graphics-smooth";
import ECSComponent from "../EntityComponentSystem/Component";
import * as PIXI from "pixi.js";
import Vec2 from "../Vec2";
import { InverseScalingFn, ScalingFn } from "../Utils/math";
import { VEC_FONT_NAME } from "../constants";

export class ShowVectorData {
  readonly id: string;
  // vector to be shown
  vec: Vec2 | null = null;
  // controlling how it should be displayed
  label: string;
  units: string;
  color: number;

  arrowGraphic = new SmoothGraphics();
  pixiText = new PIXI.BitmapText("", { fontName: VEC_FONT_NAME });

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
