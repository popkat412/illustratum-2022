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

  mult(s: number): Vec2 {
    return new Vec2(this.x * s, this.y * s);
  }

  div(s: number): Vec2 {
    return new Vec2(this.x / s, this.y / s);
  }

  normalize(): Vec2 {
    return this.div(this.mag());
  }

  neg(): Vec2 {
    return this.mult(-1);
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
