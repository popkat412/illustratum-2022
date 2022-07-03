import ParticleComponent from "../Components/ParticleComponent";
import PixiContainerComponent from "../Components/PIXIContainerComponent";
import ShowDistanceComponent, {
  ShowDistanceData,
} from "../Components/ShowDistanceComponent";
import { DISP_EXP_DIGITS } from "../constants";
import ECSEntity from "../EntityComponentSystem/Entity";
import ECSSystem from "../EntityComponentSystem/System";
import { HasRenderScale } from "../Environments/EnvironmentInterfaces";
import { sgn } from "../Utils/math";
import Vec2 from "../Vec2";

export default class ShowDistanceSystem<
  E extends HasRenderScale
> extends ECSSystem<E> {
  setup(): void {
    for (const [
      entity,
      { showDistDataArr },
    ] of this.entityManager.allEntitiesWithComponent<ShowDistanceComponent>(
      ShowDistanceComponent
    )) {
      for (const showDistData of showDistDataArr) {
        this.setupShowDistData(entity, showDistData);
      }
    }
  }

  update(_deltaTime: number): void {
    for (const [
      entity,
      { showDistDataArr },
    ] of this.entityManager.allEntitiesWithComponent<ShowDistanceComponent>(
      ShowDistanceComponent
    )) {
      for (const showDistData of showDistDataArr) {
        const { target, lineGraphic, pixiText, color, _setupDone } =
          showDistData;

        if (!_setupDone) this.setupShowDistData(entity, showDistData);

        const particleComponent =
          this.entityManager.getComponent<ParticleComponent>(
            entity,
            ParticleComponent
          );
        const targetParticleComponent =
          this.entityManager.getComponent<ParticleComponent>(
            target,
            ParticleComponent
          );

        if (!(particleComponent && targetParticleComponent)) continue;

        const pos = particleComponent.pos;
        const targetPos = targetParticleComponent.pos;

        const diff = targetPos.sub(pos); // points from entity to target
        const dist = diff.mag();
        const orientation = -sgn(diff.dot(Vec2.RIGHT), 1);

        // line
        lineGraphic.clear();
        lineGraphic.lineStyle({ color, width: 1 });
        const lineLength = dist * this.environment.scaleFactor;
        const LINE_OFFSET = 40,
          TAIL_LENGTH = 20,
          TEXT_OFFSET = 20;
        // first draw it vertically, then rotate
        lineGraphic.moveTo(LINE_OFFSET, 0);
        lineGraphic.lineTo(LINE_OFFSET + TAIL_LENGTH, 0);
        lineGraphic.lineTo(LINE_OFFSET + TAIL_LENGTH, -lineLength);
        lineGraphic.lineTo(LINE_OFFSET, -lineLength);
        lineGraphic.rotation = diff.angle();

        // text
        pixiText.text = `${dist.toExponential(DISP_EXP_DIGITS)} m`;
        const heightOffset = orientation < 0 ? pixiText.height : 0;
        pixiText.pivot.y =
          orientation * (LINE_OFFSET + TAIL_LENGTH + TEXT_OFFSET) +
          heightOffset; // remember, the pivot is in its _local_ coordinate space
        pixiText.pivot.x = orientation * (lineLength / 2) + pixiText.width / 2;
        pixiText.rotation = diff.angle() + Math.PI / 2;
        pixiText.scale.y = orientation;
        pixiText.scale.x = orientation;
      }
    }
  }

  private setupShowDistData(
    entity: ECSEntity,
    showDistData: ShowDistanceData
  ): void {
    const { lineGraphic, pixiText, color } = showDistData;
    lineGraphic.zIndex = -1;
    lineGraphic.pivot.set(0, 0);

    pixiText.zIndex = -1;
    pixiText.style.fill = "#" + color.toString(16);
    pixiText.style.fontSize = 15;

    const pixiContainerComponent =
      this.entityManager.getComponent<PixiContainerComponent>(
        entity,
        PixiContainerComponent
      );

    if (pixiContainerComponent) {
      pixiContainerComponent.container.addChild(lineGraphic);
      pixiContainerComponent.container.addChild(pixiText);
      pixiContainerComponent.container.sortChildren();
    }

    showDistData._setupDone = true;
  }
}
