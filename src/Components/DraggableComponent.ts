import * as PIXI from "pixi.js";
import ECSComponent from "../EntityComponentSystem/Component";

export default class DraggableComponent extends ECSComponent {
  pointerData: PIXI.InteractionData | null = null;
}
