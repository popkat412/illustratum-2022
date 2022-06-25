import * as PIXI from "pixi.js";
import ParticleComponent from "../Components/ParticleComponent";
import { ASTRONIMICAL_UNIT, EARTH_MASS, SUN_MASS } from "../constants";
import { addCelestialBody } from "../Entities/CelestialBody";
import ECSEntity from "../EntityComponentSystem/Entity";
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
  private sunEntity: ECSEntity;
  private earthEntity: ECSEntity;

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
    this.sunEntity = addCelestialBody(this.entityManager, {
      // sun
      mass: SUN_MASS,
      color: randInt(0, 0xffffff),
      radius: 25,
      fixed: true,
      initialPos: this.sunInitialPos,
    });

    this.earthEntity = addCelestialBody(this.entityManager, {
      // earth
      mass: EARTH_MASS,
      color: randInt(0, 0xffffff),
      radius: 20,
      initialPos: this.earthInitialPos,
      initialVel: this.earthInitialVel,
    });

    this.earthParticleComponent.showVelocityVector = true;
  }

  readonly goalMessage =
    "Give the planet an initial velocity such that it goes into circular orbit.";
  goalIsMet(): boolean {
    return false;
  }

  // TODO: make this just save a copy of all their initial components
  reset(): void {
    super.reset();

    this.earthParticleComponent.pos = this.earthInitialPos;
    this.earthParticleComponent.vel = this.earthInitialVel;

    const canvas = this.trailRendererSystem.canvas;
    this.trailRendererSystem.context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  // a bunch of helper functions
  private get earthParticleComponent(): ParticleComponent {
    return this.entityManager.getComponent<ParticleComponent>(
      this.earthEntity,
      ParticleComponent
    )!;
  }

  private get sunInitialPos(): Vec2 {
    const app = this.environment.app;
    const scaleFactor = this.environment.scaleFactor;
    return new Vec2(
      app.renderer.width / 2 / scaleFactor,
      app.renderer.height / 2 / scaleFactor
    );
  }

  private get earthInitialPos(): Vec2 {
    const app = this.environment.app;
    const scaleFactor = this.environment.scaleFactor;
    return new Vec2(
      app.renderer.width / 2 / scaleFactor + ASTRONIMICAL_UNIT,
      app.renderer.height / 2 / scaleFactor
    );
  }

  private get earthInitialVel(): Vec2 {
    const earthSpeed = Math.sqrt(
      (this.environment.gravitationalConstant * SUN_MASS) / ASTRONIMICAL_UNIT
    );
    return new Vec2(0, earthSpeed);
  }

  private get trailRendererSystem(): TrailRendererSystem<NBodySystemEnvironment> {
    return this.systems.filter(
      (x) => x instanceof TrailRendererSystem
    )[0] as TrailRendererSystem<NBodySystemEnvironment>;
  }
}
