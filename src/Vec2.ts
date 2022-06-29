import { approxEq } from "./Utils/math";

/**
  Basic 2D vector class containing only the methods I need.
  Should ideally be treated as immutable
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

  static fromVec({ x, y }: { x: number; y: number }): Vec2 {
    return new Vec2(x, y);
  }

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

  setMag(s: number, assumeAngle: number | false = false): Vec2 {
    if (this.mag() == 0) {
      if (assumeAngle === false) {
        console.warn("Vec2: attempting to setMag a zero vector, no effect");
        return new Vec2();
      } else {
        return Vec2.UP.mult(s).rotate(assumeAngle);
      }
    }
    return this.normalize().mult(s);
  }

  mult(s: number): Vec2 {
    return new Vec2(this.x * s, this.y * s);
  }

  multComponents(v: Vec2): Vec2 {
    return new Vec2(this.x * v.x, this.y * v.y);
  }

  div(s: number): Vec2 {
    if (s == 0) {
      throw new Error("Vec2: division by zero");
    }
    return new Vec2(this.x / s, this.y / s);
  }

  normalize(): Vec2 {
    if (this.mag() == 0) {
      console.warn("Vec2: normalizing zero vector");
      return new Vec2();
    }
    return this.div(this.mag());
  }

  dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y;
  }

  approxEq(other: Vec2, magPlusMinus: number, anglePlusMinus: number): boolean {
    return (
      approxEq(this.mag(), other.mag(), magPlusMinus) &&
      approxEq(this.angle(), other.angle(), anglePlusMinus)
    );
  }

  neg(): Vec2 {
    return this.mult(-1);
  }

  // angle to the _vertical_ in _radians_
  // 0 degress points UP in _pixi space_
  angle(): number {
    if (this.mag() == 0) {
      console.warn("Vec2.angle() is 0 for zero vector");
    }
    return Math.atan2(this.y, this.x) + Math.PI / 2;
  }

  // angle to the _vertical_ in _radians_
  // 0 degress points UP in _pixi space_
  setAngle(angle: number): Vec2 {
    return new Vec2(Math.sin(angle), Math.cos(angle)).mult(-this.mag());
  }

  rotate(angle: number): Vec2 {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return new Vec2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  fmap(fn: (n: number) => number): Vec2 {
    return new Vec2(fn(this.x), fn(this.y));
  }

  copy(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  toString(): string {
    return `(${this.x.toExponential(1)}, ${this.y.toExponential(1)})`;
  }
}
