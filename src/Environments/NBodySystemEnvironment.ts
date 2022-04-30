import { HasGravitationalConstant } from "../Systems/GravitySystem";
import { HasRenderScale, HasTimeFactor } from "../Systems/MoveParticleSystem";
import { HasPixiApp } from "../Systems/RendererSystem";
import * as PIXI from "pixi.js";

export default class NBodySystemEnvironment
  implements
    HasPixiApp,
    HasRenderScale,
    HasTimeFactor,
    HasGravitationalConstant
{
  app: PIXI.Application;

  readonly gravitationalConstant: number = 6.67408e-11;

  scaleFactor: number = 1e-9;
  timeFactor: number = 1e5;

  constructor(app: PIXI.Application) {
    this.app = app;
  }
}
