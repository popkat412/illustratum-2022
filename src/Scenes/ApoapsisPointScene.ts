import * as PIXI from "pixi.js";
import NBodySystemEnvironment from "../Environments/NBodySystemEnvironment";
import Scene from "./Scene";
import GravitySystem from "../Systems/GravitySystem";
import MoveParticleSystem from "../Systems/MoveParticleSystem";
import RendererSystem from "../Systems/RendererSystem";
import ShowDistanceSystem from "../Systems/ShowDistanceSystem";
import ShowVectorSystem from "../Systems/ShowVectorSystem";
import TrailRendererSystem from "../Systems/TrailRendererSystem";
import ECSEntity from "../EntityComponentSystem/Entity";
import { addCelestialBody } from "../Entities/CelestialBody";
import {
  DISP_EXP_DIGITS,
  EARTH_COLOR,
  EARTH_MASS,
  SUN_COLOR,
  SUN_MASS,
} from "../constants";
import Vec2 from "../Vec2";
import ParticleComponent from "../Components/ParticleComponent";
import { showHtmlExponential } from "../Utils/render";
import { EllipseData } from "../Utils/math";
import { RAD_TO_DEG } from "pixi.js";

export default class ApoapsisPointScene extends Scene<NBodySystemEnvironment> {
  earthEntity: ECSEntity;
  sunEntity: ECSEntity;

  private readonly orbitEllipse: EllipseData;

  constructor(htmlContainer: HTMLDivElement) {
    const app = new PIXI.Application();
    const environment = new NBodySystemEnvironment(app);
    environment.timeFactor *= 1.5; // make time go slightly faster :p
    super(htmlContainer, environment);

    this.systems = [
      new GravitySystem(this.entityManager, this.environment),
      new MoveParticleSystem(this.entityManager, this.environment),
      new RendererSystem(this.entityManager, this.environment),
      new TrailRendererSystem(this.entityManager, this.environment),
      new ShowVectorSystem(this.entityManager, this.environment),
      new ShowDistanceSystem(this.entityManager, this.environment),
    ];

    // orbital ellipse
    const { width, height } = this.environment.app.renderer;
    const scaleFactor = this.environment.scaleFactor;
    const semiMajorAxis = ((1 / 3) * width) / scaleFactor;
    const semiMinorAxis = (height - 150) / 2 / scaleFactor;
    const centre = new Vec2(width / 2, height / 2).div(scaleFactor);
    this.orbitEllipse = new EllipseData(centre, semiMajorAxis, semiMinorAxis);

    // set up entities
    this.earthEntity = addCelestialBody(this.entityManager, {
      mass: EARTH_MASS,
      color: EARTH_COLOR,
      radius: 20,
      initialPos: this.initialEarthPos,
      initialVel: this.initialEarthVel,
    });
    this.sunEntity = addCelestialBody(this.entityManager, {
      mass: SUN_MASS,
      color: SUN_COLOR,
      radius: 25,
      // fixed: true,
      initialPos: this.initialSunPos,
    });

    this.htmlContainer.style.cursor = "pointer";
    this.app.stage.interactive = true;
    const THRESHOLD = 50 / this.environment.scaleFactor;
    this.app.stage.on("pointerdown", () => {
      const pos = this.earthParticleComponent.pos;
      const delta = pos.sub(this.apoapsisPoint).mag();
      const htmlDispDelta = showHtmlExponential(delta, DISP_EXP_DIGITS);
      console.log({ THRESHOLD });
      if (delta < THRESHOLD) {
        this.goalMetStatus.success(
          `You got it within ${htmlDispDelta} m of the real apoapsis point.`
        );
      } else {
        this.goalMetStatus.failure(
          `You werer ${htmlDispDelta} m off the real apoapsis point.`
        );
      }
    });

    //
  }

  reset(): void {
    super.reset();

    this.earthParticleComponent.pos = this.initialEarthPos;
    this.earthParticleComponent.vel = this.initialEarthVel;

    const canvas = this.trailRendererSystem.canvas;
    this.trailRendererSystem.context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  readonly goalMessage =
    "Click anywhere when the blue planet reaches its apoapsis point";

  private get initialSunPos(): Vec2 {
    return this.orbitEllipse.leftFocus;
  }

  private get initialEarthPos(): Vec2 {
    return this.orbitEllipse.pointAtAngle(this.initialEarthAngle);
  }

  private get initialEarthAngle(): number {
    return Math.PI / 4;
  }

  private get initialEarthVel(): Vec2 {
    const mu = this.environment.gravitationalConstant * SUN_MASS;
    const r = this.initialEarthPos.dist(this.initialSunPos);
    return this.orbitEllipse.calculateOrbitalVel(this.initialEarthAngle, mu, r);
  }

  private get apoapsisPoint(): Vec2 {
    return this.orbitEllipse.rightVertex;
  }

  private get app(): PIXI.Application {
    return this.environment.app;
  }

  private get earthParticleComponent(): ParticleComponent {
    return this.entityManager.getComponent<ParticleComponent>(
      this.earthEntity,
      ParticleComponent
    )!;
  }

  private get trailRendererSystem(): TrailRendererSystem<NBodySystemEnvironment> {
    return this.systems.filter(
      (x) => x instanceof TrailRendererSystem
    )[0] as TrailRendererSystem<NBodySystemEnvironment>;
  }
}
