import GravityComponent from "../Components/GravityComponent";
import ParticleComponent from "../Components/ParticleComponent";
import {
  HasFieldLinesColor,
  HasGravitationalConstant,
  HasPixiApp,
  HasRenderScale,
} from "../Environments/EnvironmentInterfaces";
import { divergence, VectorField } from "../Utils/math";
import { unzipList } from "../Utils/prog";
import { smoothCurveThroughPoints } from "../Utils/render";
import Vec2 from "../Vec2";
import BaseCanvasSystem from "./BaseCanvasSystem";
import { gravitationlField } from "./GravitySystem";

const NUM_RADIAL_DIRS = 8;
const MASS_THRESHOLD = 1e29;

export default class FieldLinesSystem<
  E extends HasGravitationalConstant &
    HasPixiApp &
    HasRenderScale &
    HasFieldLinesColor
> extends BaseCanvasSystem<E> {
  setup() {}

  update() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const [entities] = unzipList(
      this.entityManager.allEntitiesWithComponent<GravityComponent>(
        GravityComponent
      )
    );
    const particleComponents: ParticleComponent[] = entities
      .map((e) =>
        this.entityManager.getComponent<ParticleComponent>(e, ParticleComponent)
      )
      .filter((e) => e) as ParticleComponent[];

    for (const entity of entities) {
      const particleComponent =
        this.entityManager.getComponent<ParticleComponent>(
          entity,
          ParticleComponent
        );
      if (!particleComponent) continue;

      if (particleComponent.mass < MASS_THRESHOLD) continue;

      // do everything in canvas coords
      const canvasCoord = particleComponent.pos.mult(
        this.environment.scaleFactor
      );

      this.context.strokeStyle = this.environment.fieldLinesColor;
      this.context.lineWidth = 3;

      for (let i = 0; i < NUM_RADIAL_DIRS; i++) {
        this.context.beginPath();
        const angle = (i * 2 * Math.PI) / NUM_RADIAL_DIRS;
        const displacement = Vec2.UP.rotate(angle);
        const startingCoord = canvasCoord.add(displacement);

        let coord = startingCoord;
        // todo: stop when the new coord reaches a somewhat stable position
        let count = 0;
        const inflooplim = 1000;

        const curvePoints: Vec2[] = [startingCoord];
        while (
          count < inflooplim &&
          coord.x > 0 &&
          coord.x < this.canvas.width &&
          coord.y > 0 &&
          coord.y < this.canvas.height
        ) {
          count++;
          const pos = coord.div(this.environment.scaleFactor);
          const field = gravitationlField(
            pos,
            particleComponents,
            this.environment.gravitationalConstant
          );
          if (!field) break;

          // determine what the step size should be, depending on how fast the field is changing
          // i need a sort of "derivative" for the vector field, aka
          // i need a number that quantifies how rapidly the *direction* of the field is changing
          // i think what i'm looking for is the divergence at that point???
          const f: VectorField = (
            inpt: Vec2 // partially apply the gravitationlField function
          ) =>
            gravitationlField(
              inpt,
              particleComponents,
              this.environment.gravitationalConstant
            );
          const div = divergence(f, pos, 1000);
          // console.log(div, pos.mult(this.environment.scaleFactor).toString());

          const stepSize = 20;
          const step = field.setMag(stepSize).neg();
          const nextCoord = coord.add(step);
          curvePoints.push(nextCoord);
          coord = nextCoord;
        }
        if (count >= inflooplim) {
          console.error("infinite loop in drawing field lines, stopping");
        }
        smoothCurveThroughPoints(this.context, curvePoints);
        this.context.stroke();
      }
    }
    this.texture.update();
  }
}
