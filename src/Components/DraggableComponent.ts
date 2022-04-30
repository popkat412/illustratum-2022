import Component from "../EntitySystem/Component";
import * as PIXI from "pixi.js";

export default class DraggableComponent extends Component {
  pointerData: PIXI.InteractionData | null = null;
  draggedFilter: PIXI.Filter;

  constructor(draggedFilter?: PIXI.Filter) {
    super();
    this.draggedFilter = draggedFilter || new PIXI.Filter();
  }
}
