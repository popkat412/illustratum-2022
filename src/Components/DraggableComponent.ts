import * as PIXI from "pixi.js";
import ECSComponent from "../EntityComponentSystem/Component";

export default class DraggableComponent extends ECSComponent {
  pointerData: PIXI.InteractionData | null = null;
  draggedFilter: PIXI.Filter;

  constructor(draggedFilter?: PIXI.Filter) {
    super();
    this.draggedFilter = draggedFilter || new PIXI.Filter();
  }
}
