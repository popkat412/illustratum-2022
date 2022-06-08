import ShowVectorComponent from "../Components/ShowVectorComponent";
import ECSSystem from "../EntityComponentSystem/System";
import { mapRange, sgn } from "../Utils/math";
import { updateArrowGraphic } from "../Utils/render";
import PixiContainerComponent from "../Components/PIXIContainerComponent";
import Vec2 from "../Vec2";

export default class ShowVectorSystem<E> extends ECSSystem<E> {
  setup() {
    for (const [
      entity,
      { arrowGraphic, pixiText },
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
      _entity,
      { vec, label, units, color, arrowGraphic, pixiText },
    ] of this.entityManager.allEntitiesWithComponent<ShowVectorComponent>(
      ShowVectorComponent
    )) {
      arrowGraphic.clear();
      pixiText.text = "";
      pixiText.style.fontSize = 13;
      pixiText.style.fill = color;

      if (!vec) continue;
      arrowGraphic.rotation = vec.angle();

      const h = this.scaleMag(vec.mag());
      arrowGraphic.beginFill(color);
      updateArrowGraphic(h, arrowGraphic, {
        arrowWidth: 10,
        arrowheadHeight: 10,
        arrowheadWidth: 20,
      });

      pixiText.text = `${label} = ${vec.mag().toExponential(1)} ${units}`;
      const upOrDown = sgn(Vec2.UP.dot(vec));
      const textOffset = vec.rotate(Math.PI / 2).setMag(upOrDown * 20);
      const textPos = vec.setMag(h * 0.75).add(textOffset);
      pixiText.x = textPos.x;
      pixiText.y = textPos.y;
    }
  }

  private scaleMag(mag: number): number {
    const k = 1e22;
    return mapRange(Math.sqrt(mag / k), 0, 5, 20, 80, true);
  }
}
