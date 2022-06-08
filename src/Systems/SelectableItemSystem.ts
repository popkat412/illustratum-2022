import PixiGraphicsRenderComponent from "../Components/PIXIGraphicsRenderComponent";
import SelectableComponent from "../Components/SelectableComponent";
import ECSSystem from "../EntityComponentSystem/System";
import { removeAllByValue } from "../Utils/prog";

export default class SelectableItemSystem<E> extends ECSSystem<E> {
  setup() {}

  update() {
    for (const [
      entity,
      selectableComponent,
    ] of this.entityManager.allEntitiesWithComponent<SelectableComponent>(
      SelectableComponent
    )) {
      const pixiGraphicsComponent =
        this.entityManager.getComponent<PixiGraphicsRenderComponent>(
          entity,
          PixiGraphicsRenderComponent
        );
      if (pixiGraphicsComponent) {
        const { pixiGraphics } = pixiGraphicsComponent;
        const prev = selectableComponent.previousIsSelected;
        const curr = selectableComponent.isSelected;
        if (!prev && curr) {
          // apply the filters
          if (!pixiGraphics.filters) pixiGraphics.filters = [];
          for (const filter of selectableComponent.selectedFilters)
            pixiGraphics.filters.push(filter);
        }
        if (prev && !curr) {
          // remove the filters
          if (pixiGraphics.filters) {
            for (const filter of selectableComponent.selectedFilters) {
              removeAllByValue(pixiGraphics.filters, filter);
            }
          }
        }
      }
      selectableComponent.previousIsSelected = selectableComponent.isSelected;
    }
  }
}
