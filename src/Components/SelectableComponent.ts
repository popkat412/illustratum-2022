import * as PIXI from "pixi.js";
import ECSComponent from "../EntityComponentSystem/Component";

export default class DraggableComponent extends ECSComponent {
  isSelected = false;
  previousIsSelected = false;

  selectedFilters: PIXI.Filter[];

  constructor(draggedFilter: PIXI.Filter[]) {
    super();
    this.selectedFilters = draggedFilter;
  }
}
