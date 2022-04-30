import Component from "../EntitySystem/Component";
import Vec2 from "../Vec2";

export interface ParticleComponentOptions {
  pos: Vec2;
  vel: Vec2;
  acc: Vec2;
  mass: number;
  fixed: boolean;
}

export default class ParticleComponent extends Component {
  private _pos: Vec2; // position
  private _prevPos: Vec2 = new Vec2();

  vel: Vec2; // velocity
  acc: Vec2; // acceleration

  get pos(): Vec2 {
    return this._pos;
  }

  get prevPos(): Vec2 {
    return this._prevPos;
  }

  set pos(newPos: Vec2) {
    this._prevPos = this._pos.copy();
    this._pos = newPos;
  }

  mass: number;
  fixed: boolean;

  constructor(opts?: Partial<ParticleComponentOptions>) {
    super();
    this._pos = opts?.pos || new Vec2();
    this.vel = opts?.vel || new Vec2();
    this.acc = opts?.acc || new Vec2();
    this.mass = opts?.mass || 1;
    this.fixed = opts?.fixed || false;
  }

  // helper method
  applyForce(f: Vec2): void {
    this.acc = this.acc.add(f.div(this.mass));
  }
}
