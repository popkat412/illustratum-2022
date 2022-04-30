import * as PIXI from "pixi.js";
import DraggableComponent from "../Components/DraggableComponent";
import ParticleComponent from "../Components/ParticleComponent";
import PixiGraphicsRenderComponent from "../Components/PIXIGraphicsRenderComponent";
import ECSSystem from "../EntityComponentSystem/System";
import { HasRenderScale } from "../Environments/EnvironmentInterfaces";
import { removeAllByValue, updateParticleComponent } from "../utils";

export default class DraggableItemSystem<
  E extends HasRenderScale
> extends ECSSystem<E> {
  // TODO: make this work if the DraggableComponent gets deleted sometime after setup
  setup() {
    for (const [
      entity,
      draggableComponent,
    ] of this.entityManager.allEntitiesWithComponent<DraggableComponent>(
      DraggableComponent
    )) {
      const pixiGraphicsComponent =
        this.entityManager.getComponent<PixiGraphicsRenderComponent>(
          entity,
          PixiGraphicsRenderComponent
        );
      const particleComponent =
        this.entityManager.getComponent<ParticleComponent>(
          entity,
          ParticleComponent
        );

      if (pixiGraphicsComponent) {
        const { pixiGraphics } = pixiGraphicsComponent;

        pixiGraphics.buttonMode = true;
        pixiGraphics.interactive = true;

        const onDragStart = (ev: PIXI.InteractionEvent) => {
          console.log(ev);

          // do nothing if the DraggableComponent got removed
          if (!this.entityManager.getComponent(entity, DraggableComponent))
            return;

          if (!pixiGraphics.filters) pixiGraphics.filters = [];
          pixiGraphics.filters.push(draggableComponent.draggedFilter);

          draggableComponent.pointerData = ev.data;
          if (particleComponent) {
            console.log("here");
            particleComponent.fixed = true;
          }
        };

        const onDragEnd = () => {
          // do nothing if the DraggableComponent got removed
          if (!this.entityManager.getComponent(entity, DraggableComponent))
            return;

          if (pixiGraphics.filters) {
            removeAllByValue(
              pixiGraphics.filters,
              draggableComponent.draggedFilter
            );
          }

          draggableComponent.pointerData = null;
          if (particleComponent) {
            particleComponent.fixed = false;
          }
        };

        const onDragMove = () => {
          // do nothing if the DraggableComponent got removed
          if (!this.entityManager.getComponent(entity, DraggableComponent))
            return;

          if (draggableComponent.pointerData) {
            const newPos = draggableComponent.pointerData.getLocalPosition(
              pixiGraphics.parent
            );
            pixiGraphics.x = newPos.x;
            pixiGraphics.y = newPos.y;

            if (particleComponent) {
              updateParticleComponent(
                pixiGraphicsComponent,
                particleComponent,
                this.environment.scaleFactor
              );
            }
          }
        };

        pixiGraphics.on("pointerdown", onDragStart);
        pixiGraphics.on("pointermove", onDragMove);
        pixiGraphics.on("pointerup", onDragEnd);
        pixiGraphics.on("pointerupoutside", onDragEnd);
      }
    }
  }

  update(_deltaTime: number) {}
}
