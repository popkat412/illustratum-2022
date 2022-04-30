import * as PIXI from "pixi.js";
import {
  HasGravitationalConstant,
  HasPixiApp,
  HasRenderScale,
  HasTimeFactor,
} from "./EnvironmentInterfaces";

export default class NBodySystemEnvironment
  implements
    HasPixiApp,
    HasRenderScale,
    HasTimeFactor,
    HasGravitationalConstant
{
  app: PIXI.Application;

  readonly gravitationalConstant: number = 6.67408e-11;

  scaleFactor = 1e-9;
  timeFactor = 1e5;

  constructor(app: PIXI.Application) {
    this.app = app;
  }
}
