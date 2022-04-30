import Component from "../EntitySystem/Component";

export default class TrailRenderComponent extends Component {
  trailColor: number;

  constructor(trailColor: number) {
    super();
    this.trailColor = trailColor;
  }
}
