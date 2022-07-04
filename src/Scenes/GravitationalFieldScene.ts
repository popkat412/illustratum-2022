import * as PIXI from "pixi.js";
import ParticleComponent from "../Components/ParticleComponent";
import {
  ASTRONIMICAL_UNIT,
  EARTH_COLOR,
  EARTH_MASS,
  SUN_COLOR,
  SUN_MASS,
} from "../constants";
import { addCelestialBody } from "../Entities/CelestialBody";
import ECSEntity from "../EntityComponentSystem/Entity";
import NBodySystemEnvironment from "../Environments/NBodySystemEnvironment";
import DraggableItemSystem from "../Systems/DraggableItemSystem";
import GravitySystem from "../Systems/GravitySystem";
import RendererSystem from "../Systems/RendererSystem";
import SelectableItemSystem from "../Systems/SelectableItemSystem";
import ShowVectorFieldSystem from "../Systems/ShowVectorFieldSystem";
import ShowVectorSystem from "../Systems/ShowVectorSystem";
import Vec2 from "../Vec2";
import Scene from "./Scene";

export default class GravitationalFieldScene extends Scene<NBodySystemEnvironment> {
  private earthEntity: ECSEntity;
  private sunEntity: ECSEntity;

  constructor(htmlContainer: HTMLDivElement) {
    const app = new PIXI.Application();
    const environment = new NBodySystemEnvironment(app);
    environment.scaleFactor = 2e-9;
    super(htmlContainer, environment);

    this.systems = [
      new GravitySystem(this.entityManager, this.environment),
      new DraggableItemSystem(this.entityManager, this.environment),
      new SelectableItemSystem(this.entityManager, this.environment),
      new RendererSystem(this.entityManager, this.environment),
      new ShowVectorSystem(this.entityManager, this.environment),
      new ShowVectorFieldSystem(this.entityManager, this.environment),
    ];

    this.earthEntity = addCelestialBody(this.entityManager, {
      mass: EARTH_MASS,
      color: EARTH_COLOR,
      radius: 20,
      fixed: true,
      initialPos: this.initialEarthPos,
      partOfFieldVisualisation: false,
    });
    this.sunEntity = addCelestialBody(this.entityManager, {
      mass: SUN_MASS,
      color: SUN_COLOR,
      radius: 25,
      fixed: true,
      initialPos: this.initialSunPos,
    });
  }

  reset(): void {
    super.reset();

    const earthParticleComponent =
      this.entityManager.getComponent<ParticleComponent>(
        this.earthEntity,
        ParticleComponent
      )!;
    earthParticleComponent.pos = this.initialEarthPos;
    const sunParticleComponent =
      this.entityManager.getComponent<ParticleComponent>(
        this.sunEntity,
        ParticleComponent
      )!;
    sunParticleComponent.pos = this.initialSunPos;
  }

  private get initialEarthPos(): Vec2 {
    const app = this.environment.app;
    const scaleFactor = this.environment.scaleFactor;
    return new Vec2(
      app.renderer.width / 2 / scaleFactor - ASTRONIMICAL_UNIT / 2,
      app.renderer.height / 2 / scaleFactor
    );
  }
  private get initialSunPos(): Vec2 {
    const app = this.environment.app;
    const scaleFactor = this.environment.scaleFactor;
    return new Vec2(
      app.renderer.width / 2 / scaleFactor + ASTRONIMICAL_UNIT / 2,
      app.renderer.height / 2 / scaleFactor
    );
  }

  readonly goalMessage = null;
}
