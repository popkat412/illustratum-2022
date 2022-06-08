import ECSSystem from "../EntityComponentSystem/System";
import {
  HasGravitationalConstant,
  HasPixiApp,
  HasRenderScale,
} from "../Environments/EnvironmentInterfaces";
import * as PIXI from "pixi.js";
import Vec2 from "../Vec2";
import { gravitationlField } from "./GravitySystem";
import GravityComponent from "../Components/GravityComponent";
import ParticleComponent from "../Components/ParticleComponent";
import { lerpColor, mapRange } from "../Utils/math";
import { unzipList, zipList } from "../Utils/prog";
import { updateArrowGraphic } from "../Utils/render";

const SAMPLE_DISTANCE = 50;

export default class ShowVectorFieldSystem<
  E extends HasPixiApp & HasGravitationalConstant & HasRenderScale
> extends ECSSystem<E> {
  arrowsContainer = new PIXI.Container();

  setup() {
    this.arrowsContainer.position.set(0, 0);
    this.arrowsContainer.zIndex = -1;
    this.environment.app.stage.addChild(this.arrowsContainer);
  }

  update() {
    this.arrowsContainer.removeChildren();

    // generate sample points (in pixi space)
    const samplePoints: Vec2[] = [];
    const width = this.environment.app.renderer.width;
    const height = this.environment.app.renderer.height;
    for (let i = SAMPLE_DISTANCE; i < width; i += SAMPLE_DISTANCE) {
      for (let j = SAMPLE_DISTANCE; j < height; j += SAMPLE_DISTANCE) {
        samplePoints.push(new Vec2(i, j));
      }
    }
    // query sample points for gravitational field
    const particleComponents: ParticleComponent[] = [];
    for (const entity of unzipList(
      this.entityManager.allEntitiesWithComponent<GravityComponent>(
        GravityComponent
      )
    )[0]) {
      const particleComponent =
        this.entityManager.getComponent<ParticleComponent>(
          entity,
          ParticleComponent
        );
      if (particleComponent) {
        particleComponents.push(particleComponent);
      }
    }
    const fields: (Vec2 | undefined)[] = samplePoints.map((v) =>
      gravitationlField(
        v.div(this.environment.scaleFactor),
        particleComponents,
        this.environment.gravitationalConstant
      )
    );

    // const fieldStrengths = fields.flatMap((v) => (v ? [v.mag()] : []));
    // console.log(Math.min(...fieldStrengths), Math.max(...fieldStrengths));

    // draw the arrow
    for (const [coord, field] of zipList(samplePoints, fields)) {
      if (!field) continue;
      const arrowGraphic = new PIXI.Graphics();
      arrowGraphic.beginFill(this.getColor(field.mag()));
      updateArrowGraphic(this.scaleMag(field.mag()), arrowGraphic, {
        arrowWidth: 5,
        arrowheadWidth: 10,
        arrowheadHeight: 5,
        centre: "bottom",
      });
      arrowGraphic.x = coord.x;
      arrowGraphic.y = coord.y;
      arrowGraphic.rotation = field.angle();
      this.arrowsContainer.addChild(arrowGraphic);
    }
  }

  private getColor(mag: number): number {
    const small = 0x75a9ff,
      large = 0xff6767;
    return lerpColor(
      small,
      large,
      mapRange(Math.sqrt(mag), 0, Math.sqrt(0.1), 0, 1, true) // scuffed "linear" interpolation kekw
    );
  }

  private scaleMag(mag: number): number {
    return mapRange(mag, 0, 0.1, 10, SAMPLE_DISTANCE / 2.5, true);
  }
}
