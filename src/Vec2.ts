/**
  Basic 2D vector class containing only the methods I need.
*/
export default class Vec2 {
  x: number;
  y: number;

  constructor();
  constructor(x: number, y: number);
  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  // in pixi coord space
  static readonly UP = new Vec2(0, -1);
  static readonly RIGHT = new Vec2(1, 0);

  add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  sub(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  magSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  setMag(s: number): Vec2 {
    return this.normalize().mult(s);
  }

  mult(s: number): Vec2 {
    return new Vec2(this.x * s, this.y * s);
  }

  div(s: number): Vec2 {
    console.assert(s != 0);
    return new Vec2(this.x / s, this.y / s);
  }

  normalize(): Vec2 {
    return this.div(this.mag());
  }

  dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y;
  }

  neg(): Vec2 {
    return this.mult(-1);
  }

  // angle to the *vertical* in *radians*
  angle(): number {
    return Math.atan2(this.y, this.x) + Math.PI / 2;
  }

  rotate(angle: number): Vec2 {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return new Vec2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  toString(): string {
    return `(${this.x.toExponential(1)}, ${this.y.toExponential(1)})`;
  }
}
