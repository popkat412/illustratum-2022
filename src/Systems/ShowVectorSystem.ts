import ShowVectorComponent from "../Components/ShowVectorComponent";
import ECSSystem from "../EntityComponentSystem/System";
import { sgn } from "../Utils/math";
import { updateArrowGraphic } from "../Utils/render";
import PixiContainerComponent from "../Components/PIXIContainerComponent";
import Vec2 from "../Vec2";
import { DISP_EXP_DIGITS } from "../constants";

export default class ShowVectorSystem<E> extends ECSSystem<E> {
  textPosFn: (vec: Vec2, h: number) => Vec2 = this.defaultTextPos;

  setup() {
    for (const [
      entity,
      { vectorDataArr },
    ] of this.entityManager.allEntitiesWithComponent<ShowVectorComponent>(
      ShowVectorComponent
    )) {
      for (const { arrowGraphic, pixiText } of vectorDataArr) {
        arrowGraphic.zIndex = -1;
        pixiText.zIndex = 2;

        const pixiContainerComponent =
          this.entityManager.getComponent<PixiContainerComponent>(
            entity,
            PixiContainerComponent
          );
        if (pixiContainerComponent) {
          pixiContainerComponent.container.addChild(arrowGraphic);
          pixiContainerComponent.container.addChild(pixiText);
          pixiContainerComponent.container.sortChildren();
        }
      }
    }
  }

  update() {
    for (const [
      ,
      { vectorDataArr },
    ] of this.entityManager.allEntitiesWithComponent<ShowVectorComponent>(
      ShowVectorComponent
    )) {
      for (const {
        vec,
        label,
        units,
        color,
        arrowGraphic,
        pixiText,
        scalingFn,
      } of vectorDataArr) {
        pixiText.text = "";
        pixiText.style.fontSize = 13;
        pixiText.style.fill = color;

        arrowGraphic.clear();

        if (!vec) continue;
        arrowGraphic.rotation = vec.angle();

        const h = scalingFn(vec.mag());
        arrowGraphic.beginFill(color);
        updateArrowGraphic(h, arrowGraphic, {
          arrowWidth: 10,
          arrowheadHeight: 10,
          arrowheadWidth: 20,
        });

        pixiText.text = `${label} = ${vec
          .mag()
          .toExponential(DISP_EXP_DIGITS)} ${units}`;
        const textPos = this.textPosFn(vec, h);
        pixiText.x = textPos.x;
        pixiText.y = textPos.y;
      }
    }
  }

  private defaultTextPos(vec: Vec2, h: number): Vec2 {
    const upOrDown = sgn(Vec2.UP.dot(vec));
    const textOffset = vec.rotate(Math.PI / 2).setMag(20);
    const textPos = vec.setMag(h * 0.75).add(textOffset.mult(upOrDown));
    return textPos;
  }
}
