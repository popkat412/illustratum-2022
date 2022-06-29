import * as PIXI from "pixi.js";
import ParticleComponent from "../Components/ParticleComponent";
import { ShowDistanceData } from "../Components/ShowDistanceComponent";
import ShowVectorComponent from "../Components/ShowVectorComponent";
import {
  ASTRONIMICAL_UNIT,
  DISP_EXP_DIGITS,
  EARTH_MASS,
  GRAVITY_SYSTEM_SHOW_VECTOR_COMPONENT_ID,
  SUN_MASS,
} from "../constants";
import { addCelestialBody } from "../Entities/CelestialBody";
import ECSEntity from "../EntityComponentSystem/Entity";
import NBodySystemEnvironment from "../Environments/NBodySystemEnvironment";
import DraggableItemSystem from "../Systems/DraggableItemSystem";
import GravitySystem from "../Systems/GravitySystem";
import MoveParticleSystem from "../Systems/MoveParticleSystem";
import RendererSystem from "../Systems/RendererSystem";
import SelectableItemSystem from "../Systems/SelectableItemSystem";
import ShowDistanceSystem from "../Systems/ShowDistanceSystem";
import ShowVectorSystem from "../Systems/ShowVectorSystem";
import { randInt } from "../Utils/math";
import { showHtmlExponential } from "../Utils/render";
import Vec2 from "../Vec2";
import Scene from "./Scene";

const GOAL_FORCE = 1e22;

export default class ForcesScene extends Scene<NBodySystemEnvironment> {
  private sunEntity: ECSEntity;
  private earthEntity: ECSEntity;

  constructor(htmlContainer: HTMLDivElement) {
    const app = new PIXI.Application();
    const environment = new NBodySystemEnvironment(app);
    environment.scaleFactor = 2e-9;
    super(htmlContainer, environment);

    // set up systems
    this.systems = [
      new GravitySystem(this.entityManager, this.environment),
      new MoveParticleSystem(this.entityManager, this.environment),
      new SelectableItemSystem(this.entityManager, this.environment),
      new DraggableItemSystem(this.entityManager, this.environment),
      new RendererSystem(this.entityManager, this.environment),
      new ShowVectorSystem(this.entityManager, this.environment),
      new ShowDistanceSystem(this.entityManager, this.environment),
    ];

    // set up entities
    this.earthEntity = addCelestialBody(this.entityManager, {
      mass: EARTH_MASS,
      color: randInt(0, 0xffffff),
      radius: 25,
      fixed: true,
      initialPos: this.initialEarthPos,
    });
    this.sunEntity = addCelestialBody(this.entityManager, {
      mass: SUN_MASS,
      color: randInt(0, 0xffffff),
      radius: 20,
      fixed: true,
      initialPos: this.initialSunPos,
      showDistData: [new ShowDistanceData(this.earthEntity)],
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

  readonly goalMessage = `Get the force of attraction to be approximately ${showHtmlExponential(
    GOAL_FORCE,
    1
  )} N`;

  update(deltaTime: number): void {
    super.update(deltaTime);

    if (this.goalIsMet()) {
      this.goalMetFn();
    }
  }

  goalIsMet(): boolean {
    const expected = GOAL_FORCE.toExponential(DISP_EXP_DIGITS);
    // a bit ugly but it'll work
    // use the ShowVectorComponent to get the forces between the two.
    // (a lot of force unwrapping but whatever)
    // TODO: refactor this
    const actual = this.earthShowVectorComponent!.getVectorData(
      GRAVITY_SYSTEM_SHOW_VECTOR_COMPONENT_ID
    )!
      .vec!.mag()
      .toExponential(DISP_EXP_DIGITS);

    return expected == actual;
  }
  goalMetFn(): void {
    if (this.goalMetStatus != "undecided") return;
    // wait half a second for better UX
    // TODO: make this not spawn like ten thousand setTimeouts
    setTimeout(() => {
      // if the goal is still met
      if (this.goalIsMet()) {
        // ok now show some tick or something
        this.goalMetStatus = "success";
      }
    }, 500);
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
  private get earthShowVectorComponent(): ShowVectorComponent | undefined {
    return this.entityManager.getComponent<ShowVectorComponent>(
      this.earthEntity,
      ShowVectorComponent
    );
  }
}
