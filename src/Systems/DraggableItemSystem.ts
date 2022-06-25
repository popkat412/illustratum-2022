import * as PIXI from "pixi.js";
import DraggableComponent from "../Components/DraggableComponent";
import ParticleComponent from "../Components/ParticleComponent";
import PixiContainerComponent from "../Components/PIXIContainerComponent";
import SelectableComponent from "../Components/SelectableComponent";
import ECSSystem from "../EntityComponentSystem/System";
import { HasRenderScale } from "../Environments/EnvironmentInterfaces";
import { updateParticleComponent } from "../Utils/render";

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
      const pixiContainerComponent =
        this.entityManager.getComponent<PixiContainerComponent>(
          entity,
          PixiContainerComponent
        );
      const particleComponent =
        this.entityManager.getComponent<ParticleComponent>(
          entity,
          ParticleComponent
        );
      const selectableComponent =
        this.entityManager.getComponent<SelectableComponent>(
          entity,
          SelectableComponent
        );

      if (pixiContainerComponent && selectableComponent) {
        const { container } = pixiContainerComponent;

        container.buttonMode = true;
        container.interactive = true;

        let previousIsFixed = particleComponent?.fixed ?? null;

        const onDragStart = (ev: PIXI.InteractionEvent) => {
          // console.log(ev);

          // do nothing if the DraggableComponent got removed
          if (!this.entityManager.getComponent(entity, DraggableComponent))
            return;

          selectableComponent.isSelected = true;

          draggableComponent.pointerData = ev.data;
          if (particleComponent) {
            previousIsFixed = particleComponent.fixed;
            particleComponent.fixed = true;
          }
        };

        const onDragEnd = () => {
          // do nothing if the DraggableComponent got removed
          if (!this.entityManager.getComponent(entity, DraggableComponent))
            return;

          selectableComponent.isSelected = false;

          draggableComponent.pointerData = null;
          if (particleComponent) {
            console.assert(previousIsFixed != null);
            particleComponent.fixed = previousIsFixed!;
            previousIsFixed = null;
          }
        };

        const onDragMove = () => {
          // do nothing if the DraggableComponent got removed
          if (!this.entityManager.getComponent(entity, DraggableComponent))
            return;

          if (draggableComponent.pointerData) {
            const newPos = draggableComponent.pointerData.getLocalPosition(
              container.parent
            );
            container.x = newPos.x;
            container.y = newPos.y;

            if (particleComponent) {
              updateParticleComponent(
                pixiContainerComponent,
                particleComponent,
                this.environment.scaleFactor
              );
            }
          }
        };

        container.on("pointerdown", onDragStart);
        container.on("pointermove", onDragMove);
        container.on("pointerup", onDragEnd);
        container.on("pointerupoutside", onDragEnd);
      }
    }
  }

  update(_deltaTime: number) {}
}
