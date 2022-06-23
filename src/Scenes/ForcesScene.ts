import * as PIXI from "pixi.js";
import { ASTRONIMICAL_UNIT, EARTH_MASS, SUN_MASS } from "../constants";
import { addCelestialBody } from "../Entities/CelestialBody";
import NBodySystemEnvironment from "../Environments/NBodySystemEnvironment";
import DraggableItemSystem from "../Systems/DraggableItemSystem";
import GravitySystem from "../Systems/GravitySystem";
import MoveParticleSystem from "../Systems/MoveParticleSystem";
import RendererSystem from "../Systems/RendererSystem";
import SelectableItemSystem from "../Systems/SelectableItemSystem";
import ShowVectorSystem from "../Systems/ShowVectorSystem";
import { randInt } from "../Utils/math";
import Vec2 from "../Vec2";
import Scene from "./Scene";

export default class ForcesScene extends Scene<NBodySystemEnvironment> {
  constructor(htmlContainer: HTMLDivElement) {
    const app = new PIXI.Application();
    const environment = new NBodySystemEnvironment(app);
    environment.scaleFactor = 2e-9;
    super(htmlContainer, environment);

    // set up systems
    const showVectorSystem = new ShowVectorSystem(
      this.entityManager,
      this.environment
    );
    this.systems = [
      new GravitySystem(this.entityManager, this.environment),
      new MoveParticleSystem(this.entityManager, this.environment),
      new SelectableItemSystem(this.entityManager, this.environment),
      new DraggableItemSystem(this.entityManager, this.environment),
      new RendererSystem(this.entityManager, this.environment),
      showVectorSystem,
    ];

    // set up entities
    addCelestialBody(this.entityManager, {
      mass: EARTH_MASS,
      color: randInt(0, 0xffffff),
      radius: 25,
      fixed: true,
      initialPos: new Vec2(
        app.renderer.width / 2 / environment.scaleFactor -
          ASTRONIMICAL_UNIT / 2,
        app.renderer.height / 2 / environment.scaleFactor
      ),
    });
    addCelestialBody(this.entityManager, {
      mass: SUN_MASS,
      color: randInt(0, 0xffffff),
      radius: 20,
      fixed: true,
      initialPos: new Vec2(
        app.renderer.width / 2 / environment.scaleFactor +
          ASTRONIMICAL_UNIT / 2,
        app.renderer.height / 2 / environment.scaleFactor
      ),
    });
  }
}
