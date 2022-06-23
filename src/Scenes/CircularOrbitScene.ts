import * as PIXI from "pixi.js";
import ParticleComponent from "../Components/ParticleComponent";
import { ASTRONIMICAL_UNIT, EARTH_MASS, SUN_MASS } from "../constants";
import { addCelestialBody } from "../Entities/CelestialBody";
import NBodySystemEnvironment from "../Environments/NBodySystemEnvironment";
import GravitySystem from "../Systems/GravitySystem";
import MoveParticleSystem from "../Systems/MoveParticleSystem";
import RendererSystem from "../Systems/RendererSystem";
import ShowVectorSystem from "../Systems/ShowVectorSystem";
import TrailRendererSystem from "../Systems/TrailRendererSystem";
import { randInt } from "../Utils/math";
import Vec2 from "../Vec2";
import Scene from "./Scene";

export default class CircularOrbitScene extends Scene<NBodySystemEnvironment> {
  constructor(htmlContainer: HTMLDivElement) {
    const app = new PIXI.Application();
    const environment = new NBodySystemEnvironment(app);
    super(htmlContainer, environment);

    // set up systems
    this.systems = [
      new GravitySystem(this.entityManager, this.environment),
      new MoveParticleSystem(this.entityManager, this.environment),
      new RendererSystem(this.entityManager, this.environment),
      new TrailRendererSystem(this.entityManager, this.environment),
      new ShowVectorSystem(this.entityManager, this.environment),
    ];

    // set up entities
    addCelestialBody(this.entityManager, {
      // sun
      mass: SUN_MASS,
      color: randInt(0, 0xffffff),
      radius: 25,
      fixed: true,
      initialPos: new Vec2(
        app.renderer.width / 2 / environment.scaleFactor,
        app.renderer.height / 2 / environment.scaleFactor
      ),
    });

    const earthSpeed = Math.sqrt(
      (this.environment.gravitationalConstant * SUN_MASS) / ASTRONIMICAL_UNIT
    );
    const earthEntity = addCelestialBody(this.entityManager, {
      // earth
      mass: EARTH_MASS,
      color: randInt(0, 0xffffff),
      radius: 20,
      initialPos: new Vec2(
        app.renderer.width / 2 / environment.scaleFactor + ASTRONIMICAL_UNIT,
        app.renderer.height / 2 / environment.scaleFactor
      ),
      initialVel: new Vec2(0, earthSpeed),
    });
    const earthParticleComponent =
      this.entityManager.getComponent<ParticleComponent>(
        earthEntity,
        ParticleComponent
      );
    if (earthParticleComponent)
      earthParticleComponent.showVelocityVector = true;
  }
}
