import ECSComponent from "../EntityComponentSystem/Component";

export default class GravityComponent extends ECSComponent {
  partOfFieldVisualisation = true;

  constructor(partOfFieldVisualisation = true) {
    super();
    this.partOfFieldVisualisation = partOfFieldVisualisation;
  }
}
