import ECSComponent from "../EntityComponentSystem/Component";

export default class TrailRenderComponent extends ECSComponent {
  trailColor: number;

  constructor(trailColor: number) {
    super();
    this.trailColor = trailColor;
  }
}
