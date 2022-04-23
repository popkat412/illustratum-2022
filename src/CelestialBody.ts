import * as PIXI from "pixi.js";
import Vec2 from "./Vec2";

export default class CelestialBody {
  pixiGraphics: PIXI.Graphics = new PIXI.Graphics();
  pixiTrailGraphics: PIXI.Graphics = new PIXI.Graphics();

  velocity: Vec2 = new Vec2();
  acceleration: Vec2 = new Vec2();
  mass: number;

  fixed: boolean = false;

  get pos(): Vec2 {
    return new Vec2(this.pixiGraphics.x, this.pixiGraphics.y);
  }

  constructor(mass: number, color: number, radius: number, fixed?: boolean) {
    this.mass = mass;
    this.fixed = fixed || false;

    this.pixiGraphics.beginFill(color);
    this.pixiGraphics.drawCircle(0, 0, radius);
    this.pixiGraphics.endFill();

    this.pixiTrailGraphics.lineStyle({width: 4, color, alpha: 0.5});
    this.pixiTrailGraphics.moveTo(0, 0);
  }

  applyForce(f: Vec2): void {
    this.acceleration = this.acceleration.add(f.div(this.mass));
  }

  update(deltaTime: number): void {
    if (this.fixed) return;

    this.velocity = this.velocity.add(this.acceleration.mult(deltaTime));

    this.pixiTrailGraphics.moveTo(this.pixiGraphics.x, this.pixiGraphics.y);

    const newPos = this.pos.add(this.velocity.mult(deltaTime));

    this.pixiGraphics.position.set(newPos.x, newPos.y);

    this.pixiTrailGraphics.lineTo(newPos.x, newPos.y);

    this.acceleration = new Vec2();
  }

  destroy(): void {
    this.pixiGraphics.destroy();
  }
}

