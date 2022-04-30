import * as PIXI from "pixi.js";

export interface HasGravitationalConstant {
  readonly gravitationalConstant: number;
}

export interface HasRenderScale {
  scaleFactor: number;
}

export interface HasTimeFactor {
  timeFactor: number;
}

export interface HasPixiApp {
  app: PIXI.Application;
}
