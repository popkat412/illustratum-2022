import * as PIXI from "pixi.js";
import NBodySystemEnvironment from "../Environments/NBodySystemEnvironment";
import Scene from "./Scene";
import GravitySystem from "../Systems/GravitySystem";
import MoveParticleSystem from "../Systems/MoveParticleSystem";
import RendererSystem from "../Systems/RendererSystem";
import ShowDistanceSystem from "../Systems/ShowDistanceSystem";
import ShowVectorSystem from "../Systems/ShowVectorSystem";
import TooltipSystem from "../Systems/TooltipSystem";
import TrailRendererSystem from "../Systems/TrailRendererSystem";

export default class ApoapsisPointScene extends Scene<NBodySystemEnvironment> {
  constructor(htmlContainer: HTMLDivElement) {
    const app = new PIXI.Application();
    const environment = new NBodySystemEnvironment(app);
    super(htmlContainer, environment);

    this.systems = [
      new GravitySystem(this.entityManager, this.environment),
      new MoveParticleSystem(this.entityManager, this.environment),
      new RendererSystem(this.entityManager, this.environment),
      new TrailRendererSystem(this.entityManager, this.environment),
      new ShowVectorSystem(this.entityManager, this.environment),
      new ShowDistanceSystem(this.entityManager, this.environment),
      new TooltipSystem(this.entityManager, this.environment),
    ];
  }

  readonly goalMessage =
    "Press space when the planet reaches its apoapsis point";
}
