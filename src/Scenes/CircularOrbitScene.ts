import * as PIXI from "pixi.js";
import { DEG_TO_RAD, RAD_TO_DEG } from "pixi.js";
import ParticleComponent from "../Components/ParticleComponent";
import PixiContainerComponent from "../Components/PIXIContainerComponent";
import ShowDistanceComponent, {
  ShowDistanceData,
} from "../Components/ShowDistanceComponent";
import ShowVectorComponent from "../Components/ShowVectorComponent";
import {
  ASTRONIMICAL_UNIT,
  EARTH_COLOR,
  EARTH_MASS,
  SUN_COLOR,
  SUN_MASS,
  VELOCITY_SHOW_VECTOR_COMPONENT_ID,
} from "../constants";
import { addCelestialBody } from "../Entities/CelestialBody";
import ECSEntity from "../EntityComponentSystem/Entity";
import NBodySystemEnvironment from "../Environments/NBodySystemEnvironment";
import GravitySystem from "../Systems/GravitySystem";
import MoveParticleSystem from "../Systems/MoveParticleSystem";
import RendererSystem from "../Systems/RendererSystem";
import ShowDistanceSystem from "../Systems/ShowDistanceSystem";
import ShowVectorSystem from "../Systems/ShowVectorSystem";
import TrailRendererSystem from "../Systems/TrailRendererSystem";
import Vec2 from "../Vec2";
import Scene from "./Scene";

// TODO: show failure when the entity leaves the screen
export default class CircularOrbitScene extends Scene<NBodySystemEnvironment> {
  private sunEntity: ECSEntity;
  private earthEntity: ECSEntity;

  private _isChoosingInitialVel = true;
  get isChoosingInitialVel(): boolean {
    return this._isChoosingInitialVel;
  }
  set isChoosingInitialVel(newVal: boolean) {
    this._isChoosingInitialVel = newVal;
    if (newVal) {
      // assuming that everything is already reset (to avoid mutual recursive loop)
      this.earthParticleComponent.fixed = true;
      this.earthParticleComponent.pos = this.earthInitialPos;
      this.earthParticleComponent.vel = this.earthInitialVel;

      // setup distance display
      this.entityManager.addComponent(
        this.sunEntity,
        new ShowDistanceComponent([new ShowDistanceData(this.earthEntity)])
      );

      // setup interaction
      this.app.stage.interactive = true;
      const pointermoveCallback = () => {
        if (!this.dragEventData) return;
        const pointerScreenCoord = new Vec2(
          this.dragEventData.global.x,
          this.dragEventData.global.y
        );
        const earthScreenCoord = Vec2.fromVec(
          this.earthPixiContainerComponent.container.getGlobalPosition()
        );

        const screenCoordDiff = pointerScreenCoord.sub(earthScreenCoord); // points from earth to cursor
        const length = screenCoordDiff.mag();
        const inverseScalingFn = this.earthShowVecComponent.getVectorData(
          VELOCITY_SHOW_VECTOR_COMPONENT_ID
        )!.inverseScalingFn;
        const velMag = inverseScalingFn(length);
        const vel = screenCoordDiff.setMag(velMag, 0);
        this.earthParticleComponent.vel = vel;
        this.updateInitialVelUI();
      };

      this.app.stage.on("pointerdown", (ev: PIXI.InteractionEvent) => {
        if (!this.isChoosingInitialVel) return;
        this.dragEventData = ev.data;
        pointermoveCallback();
      });
      this.app.stage.on("pointermove", pointermoveCallback);
      this.app.stage.on("pointerup", () => {
        if (!this.dragEventData) return;
        this.dragEventData = null;
      });

      // show UI
      this.initialVelUiDiv.style.display = "flex";
    } else {
      console.log("here");

      this.earthParticleComponent.fixed = false;

      // TODO: refactor so the component has a setup and destroy function
      // but for now i'll just have to remember to manually remove it
      this.destroyShowDistnaceComponent();

      // this.entityManager.removeComponent(this.earthEntity, TooltipComponent);
      // this.entityManager.removeComponent(this.sunEntity, TooltipComponent);

      this.initialVelUiDiv.style.display = "none";
    }
  }

  private initialVelUiDiv: HTMLDivElement;
  private magnitudeInputBox: HTMLInputElement;
  private angleInputBox: HTMLInputElement;
  private goButton: HTMLButtonElement;

  private dragEventData: PIXI.InteractionData | null = null;

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
      new ShowDistanceSystem(this.entityManager, this.environment),
    ];

    // set up entities
    this.sunEntity = addCelestialBody(this.entityManager, {
      // sun
      mass: SUN_MASS,
      color: SUN_COLOR,
      radius: 25,
      // fixed: true,
      initialPos: this.sunInitialPos,
    });

    this.earthEntity = addCelestialBody(this.entityManager, {
      // earth
      mass: EARTH_MASS,
      color: EARTH_COLOR,
      radius: 20,
      initialPos: this.earthInitialPos,
      initialVel: new Vec2(),
    });

    this.earthParticleComponent.showVelocityVector = true;

    // choosing initial vel UI (which is done in HTML and CSS instead
    // of programatically (yes i am NOT doing all that in js))
    this.initialVelUiDiv = document.getElementById(
      "circular-orbit-initial-vel-ui"
    )! as HTMLDivElement;
    this.magnitudeInputBox = document.getElementById(
      "circular-orbit-vec-magnitude"
    )! as HTMLInputElement;
    this.angleInputBox = document.getElementById(
      "circular-orbit-vec-angle"
    )! as HTMLInputElement;
    this.goButton = document.getElementById(
      "circular-orbit-go-button"
    )! as HTMLButtonElement;

    this.magnitudeInputBox.oninput = (ev) => {
      console.log(ev);
      if (!ev.target) return;
      const val = (ev.target as HTMLInputElement).value;
      const parsed = parseFloat(val);
      if (isNaN(parsed)) return;
      console.log(parsed);
      this.earthParticleComponent.vel = this.earthParticleComponent.vel.setMag(
        parsed,
        0
      );
    };
    this.angleInputBox.oninput = (ev) => {
      if (!ev.target) return;
      const val = (ev.target as HTMLInputElement).value;
      const parsed = parseFloat(val);
      if (isNaN(parsed)) return;
      this.earthParticleComponent.vel =
        this.earthParticleComponent.vel.setAngle(parsed * DEG_TO_RAD);
    };
    this.goButton.onpointerup = () => {
      const magPM = 1000,
        anglePM = 0.1;
      if (
        this.earthParticleComponent.vel.approxEq(
          this.correctInitialVel,
          magPM,
          anglePM
        ) ||
        this.earthParticleComponent.vel.approxEq(
          this.correctInitialVel.neg(),
          magPM,
          anglePM
        )
      ) {
        console.log("goalMetAlready");
        this.goalMetStatus.success();
      } else {
        setTimeout(() => {
          this.goalMetStatus.failure("That wasn't it, try again");
        }, 2000);
      }
      this.isChoosingInitialVel = false;
    };

    this.magnitudeInputBox.value = "0";
    this.angleInputBox.value = "0";

    this.isChoosingInitialVel = true; // to trigger the setter to run
  }

  readonly goalMessage =
    "Give the planet an initial velocity such that it goes into circular orbit.";

  // TODO: make this just save a copy of all their initial components
  reset(): void {
    super.reset();

    this.destroyShowDistnaceComponent();

    this.isChoosingInitialVel = true;

    this.earthParticleComponent.pos = this.earthInitialPos;
    this.earthParticleComponent.vel = this.earthInitialVel;

    const canvas = this.trailRendererSystem.canvas;
    this.trailRendererSystem.context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    this.magnitudeInputBox.value = "0";
    this.angleInputBox.value = "0";
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
    return new Vec2();
  }

  private get correctInitialVel(): Vec2 {
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

  private get earthShowVecComponent(): ShowVectorComponent {
    return this.entityManager.getComponent<ShowVectorComponent>(
      this.earthEntity,
      ShowVectorComponent
    )!;
  }

  private get earthPixiContainerComponent(): PixiContainerComponent {
    return this.entityManager.getComponent<PixiContainerComponent>(
      this.earthEntity,
      PixiContainerComponent
    )!;
  }

  private updateInitialVelUI(): void {
    if (!this.isChoosingInitialVel) return;
    const vel = this.earthParticleComponent.vel;
    this.magnitudeInputBox.value = vel.mag().toExponential(2);
    this.angleInputBox.value = (RAD_TO_DEG * vel.angle()).toFixed(1);
  }

  private get app(): PIXI.Application {
    return this.environment.app;
  }

  private destroyShowDistnaceComponent(): void {
    const entity = this.sunEntity;
    const pixiContainerComponent =
      this.entityManager.getComponent<PixiContainerComponent>(
        entity,
        PixiContainerComponent
      );
    const showDistanceData =
      this.entityManager.getComponent<ShowDistanceComponent>(
        entity,
        ShowDistanceComponent
      )?.showDistDataArr[0]; // very fragile but yes
    // TODO:             ^ refactor to use id instead
    if (!pixiContainerComponent || !showDistanceData) return;
    pixiContainerComponent.container.removeChild(showDistanceData.pixiText);
    pixiContainerComponent.container.removeChild(showDistanceData.lineGraphic);
    showDistanceData.pixiText.destroy();
    showDistanceData.lineGraphic.destroy();
    this.entityManager.removeComponent(this.sunEntity, ShowDistanceComponent);
  }
}
