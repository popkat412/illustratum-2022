import GravityComponent from "../Components/GravityComponent";
import ParticleComponent from "../Components/ParticleComponent";
import {
  HasFieldLinesColor,
  HasGravitationalConstant,
  HasPixiApp,
  HasRenderScale,
} from "../Environments/EnvironmentInterfaces";
import { unzipList } from "../utils";
import Vec2 from "../Vec2";
import BaseCanvasSystem from "./BaseCanvasSystem";
import { gravitationlField } from "./GravitySystem";

const STEP_SIZE = 20;
const NUM_RADIAL_DIRS = 8;

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
    console.log(entities);
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

      // do everything in canvas coords
      const canvasCoord = particleComponent.pos.mult(
        this.environment.scaleFactor
      );
      console.log(`canvasCoord: ${canvasCoord}`);

      this.context.strokeStyle = this.environment.fieldLinesColor;
      this.context.lineWidth = 3;

      for (let i = 0; i < NUM_RADIAL_DIRS; i++) {
        this.context.beginPath();
        const angle = (i * 2 * Math.PI) / NUM_RADIAL_DIRS;
        const displacement = Vec2.UP.rotate(angle).setMag(STEP_SIZE);
        const startingCoord = canvasCoord.add(displacement);

        this.context.moveTo(startingCoord.x, startingCoord.y);
        let coord = startingCoord;
        let count = 0;
        // todo: stop when the new coord reaches a somewhat stable position
        while (
          count < 100 &&
          coord.x > 0 &&
          coord.x < this.canvas.height &&
          coord.y > 0 &&
          coord.y < this.canvas.width
        ) {
          count++;
          const field = gravitationlField(
            coord.div(this.environment.scaleFactor),
            particleComponents,
            this.environment.gravitationalConstant
          );
          console.log(`field angle: ${(field.angle() * 180) / Math.PI}`);
          const step = field.setMag(STEP_SIZE).neg();
          const nextCoord = coord.add(step);
          this.context.lineTo(Math.round(nextCoord.x), Math.round(nextCoord.y));
          coord = nextCoord;
        }
        if (count >= 100) {
          console.error("infinite loop in drawing field lines, stopping");
        }
        this.context.stroke();
      }
    }
    this.texture.update();
  }
}
