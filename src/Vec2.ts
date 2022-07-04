import { approxEq, inIncRange, mapRange } from "./Utils/math";

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

  // vertically up is angle = 0
  static fromPolar(r: number, theta: number): Vec2 {
    const x = r * Math.sin(theta);
    const y = r * Math.cos(theta);
    return new Vec2(x, y);
  }

  add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  addX(s: number): Vec2 {
    return new Vec2(this.x + s, this.y);
  }

  addY(s: number): Vec2 {
    return new Vec2(this.x, this.y + s);
  }

  addR(s: number): Vec2 {
    const newR = this.mag() + s;
    return Vec2.fromPolar(newR, this.angle());
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

  dist(v: Vec2): number {
    return this.sub(v).mag();
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
  // very scuffed, in range [-pi/2, pi]
  angle(): number {
    if (this.mag() == 0) {
      console.warn("Vec2.angle() is 0 for zero vector");
    }
    return Math.atan2(this.y, this.x) + Math.PI / 2;
  }

  // in range [0, 2pi]
  positiveAngle(): number {
    const angle = this.angle();
    if (angle >= 0) return angle;
    return mapRange(angle, -Math.PI / 2, 0, (3 * Math.PI) / 2, 2 * Math.PI);
  }

  // angle to the _vertical_ in _radians_
  // 0 degress points UP in _pixi space_
  setAngle(angle: number): Vec2 {
    return new Vec2(Math.sin(-angle), Math.cos(-angle)).mult(-this.mag());
  }

  // those ambiguous angles will just return any quadrant that it might belong in
  // e.g. angle 0 will give either quadrant 1 or 2
  quadrant(): 1 | 2 | 3 | 4 {
    const angle = this.positiveAngle();
    if (inIncRange(angle, 0, Math.PI / 2)) return 1;
    if (inIncRange(angle, Math.PI / 2, Math.PI)) return 4;
    if (inIncRange(angle, Math.PI, (3 * Math.PI) / 2)) return 3;
    if (inIncRange(angle, (3 * Math.PI) / 2, 2 * Math.PI)) return 2;
    throw new Error(`unknown quadrant for angle ${angle}`);
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
