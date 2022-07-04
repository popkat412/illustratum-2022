import * as PIXI from "pixi.js";
import ShowVectorComponent from "../Components/ShowVectorComponent";
import ECSSystem from "../EntityComponentSystem/System";
import { sgn } from "../Utils/math";
import { updateArrowGraphic } from "../Utils/render";
import PixiContainerComponent from "../Components/PIXIContainerComponent";
import Vec2 from "../Vec2";
import { DISP_EXP_DIGITS, UPDATE_TEXT_FRAMES } from "../constants";

export default class ShowVectorSystem<E> extends ECSSystem<E> {
  textPosFn: (vec: Vec2, pixiText: PIXI.BitmapText, h: number) => Vec2 =
    this.defaultTextPos;

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

  update(_deltaTime: number, frameNum: number) {
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
        if (frameNum % UPDATE_TEXT_FRAMES == 0) pixiText.text = "";

        arrowGraphic.clear();

        if (!vec) continue;
        if (vec.mag() == 0) continue; // don't draw anything if the vector is zero
        arrowGraphic.rotation = vec.angle();

        const h = scalingFn(vec.mag());
        arrowGraphic.beginFill(color);
        updateArrowGraphic(h, arrowGraphic, {
          arrowWidth: 10,
          arrowheadHeight: 10,
          arrowheadWidth: 20,
        });

        if (frameNum % UPDATE_TEXT_FRAMES == 0)
          pixiText.text = `${label} = ${vec
            .mag()
            .toExponential(DISP_EXP_DIGITS)} ${units}`;
        const textPos = this.textPosFn(vec, pixiText, h);
        pixiText.x = textPos.x;
        pixiText.y = textPos.y;
      }
    }
  }

  private defaultTextPos(
    vec: Vec2,
    pixiText: PIXI.BitmapText,
    h: number
  ): Vec2 {
    const isUp = sgn(Vec2.UP.dot(vec), sgn(Vec2.RIGHT.dot(vec)));
    const quadrant = vec.quadrant();
    const needHeightOffset = quadrant == 2 || quadrant == 4;
    const a = vec.setMag(h * 0.5);
    const b = a.rotate((isUp * Math.PI) / 2).setMag(20);
    const c = needHeightOffset ? Vec2.UP.setMag(pixiText.height) : new Vec2();
    return a.add(b).add(c);
  }
}
