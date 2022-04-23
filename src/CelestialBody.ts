import * as PIXI from "pixi.js";
import Vec2 from "./Vec2";

export default class CelestialBody {
  pixiGraphics: PIXI.Graphics = new PIXI.Graphics();
  pixiTrailGraphics: PIXI.Graphics = new PIXI.Graphics();

  velocity: Vec2 = new Vec2();
  acceleration: Vec2 = new Vec2();
  pos: Vec2 = new Vec2(); // NOT screen coordinates
  mass: number;

  fixed: boolean = false;

  get screenCoords(): Vec2 {
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

  update(deltaTime: number, scaleFactor: number, timeFactor: number): void {
    if (this.fixed) return;

    this.velocity = this.velocity.add(this.acceleration.mult(deltaTime * timeFactor));

    this.pixiTrailGraphics.moveTo(this.pixiGraphics.x, this.pixiGraphics.y);

    this.pos = this.pos.add(this.velocity.mult(deltaTime * timeFactor));
    
    const newScreenCoord = this.pos.mult(scaleFactor);
    this.pixiGraphics.position.set(newScreenCoord.x, newScreenCoord.y);

    this.pixiTrailGraphics.lineTo(newScreenCoord.x, newScreenCoord.y);

    this.acceleration = new Vec2();
  }

  updateScreenPos(scaleFactor: number): void {
    const newScreenCoord = this.pos.mult(scaleFactor);
    this.pixiGraphics.position.set(newScreenCoord.x, newScreenCoord.y);
  }

  destroy(): void {
    this.pixiGraphics.destroy();
  }
}

