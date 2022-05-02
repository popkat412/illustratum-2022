import { Viewport } from "pixi-viewport";
import * as PIXI from "pixi.js";
import {
  HasGravitationalConstant,
  HasPixiApp,
  HasRenderScale,
  HasTimeFactor,
  HasViewport,
} from "./EnvironmentInterfaces";

export default class NBodySystemEnvironment
  implements
    HasPixiApp,
    HasRenderScale,
    HasTimeFactor,
    HasGravitationalConstant,
    HasViewport
{
  readonly app: PIXI.Application;
  readonly viewport: Viewport;
  readonly gravitationalConstant: number = 6.67408e-11;

  scaleFactor = 1e-9;
  timeFactor = 1e5;

  constructor(app: PIXI.Application, viewport: Viewport) {
    this.app = app;
    this.viewport = viewport;
  }
}
