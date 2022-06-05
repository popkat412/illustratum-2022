import ShowVectorComponent from "../Components/ShowVectorComponent";
import ECSSystem from "../EntityComponentSystem/System";
import * as PIXI from "pixi.js";
import { mapRange, sgn } from "../utils";
import PixiContainerComponent from "../Components/PIXIContainerComponent";
import Vec2 from "../Vec2";

const ARROW_WIDTH = 10;
const ARROWHEAD_SIZE = 20;
const ARROWHEAD_HEIGHT = 10;

export default class ShowVectorSystem<E> extends ECSSystem<E> {
  setup() {
    for (const [
      entity,
      {arrowGraphic, pixiText}
    ] of this.entityManager.allEntitiesWithComponent<ShowVectorComponent>(
      ShowVectorComponent
    )) {
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

  update() {
    for (const [
      entity,
      {vec, label, units, color, arrowGraphic, pixiText}
    ] of this.entityManager.allEntitiesWithComponent<ShowVectorComponent>(
      ShowVectorComponent
    )) {
      arrowGraphic.clear();
      pixiText.text = "";
      pixiText.style.fontSize = 13;
      pixiText.style.fill = color;

      if (!vec) continue;
      arrowGraphic.rotation = vec.angle();

      arrowGraphic.beginFill(color);
      const h = this.scaleMag(vec.mag());
      arrowGraphic.drawRect(-ARROW_WIDTH/2, -h, ARROW_WIDTH, h);
      arrowGraphic.drawPolygon([
        new PIXI.Point(-ARROWHEAD_SIZE/2, -h),
        new PIXI.Point(ARROWHEAD_SIZE/2, -h),
        new PIXI.Point(0, -h - ARROWHEAD_HEIGHT),
      ]);

      pixiText.text = `${label} = ${vec.mag().toExponential(1)} ${units}`;
      const upOrDown = sgn(Vec2.UP.dot(vec));
      const textOffset = vec.rotate(Math.PI/2).setMag(upOrDown * 20);
      const textPos = vec.setMag(h*0.75).add(textOffset);
      pixiText.x = textPos.x;
      pixiText.y = textPos.y;
    }
  }

  private scaleMag(mag: number): number {
    const k = 1e22;
    return mapRange(Math.sqrt(mag/k), 0, 5, 20, 80);
  }
}
