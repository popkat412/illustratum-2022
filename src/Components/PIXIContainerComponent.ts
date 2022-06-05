import * as PIXI from "pixi.js";
import ECSComponent from "../EntityComponentSystem/Component";

export default class PixiContainerComponent extends ECSComponent {
  container: PIXI.Container = new PIXI.Container();
}
