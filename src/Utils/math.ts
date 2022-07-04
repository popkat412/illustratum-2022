import * as PIXI from "pixi.js";
import Vec2 from "../Vec2";

// {{{ random stuffs
export function randFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randInt(min: number, max: number) {
  return Math.round(randFloat(min, max));
}
// }}}

// {{{ ranges and mappings
export function clampRange(x: number, low: number, high: number): number {
  return Math.max(Math.min(x, high), low);
}

export function inIncRange(x: number, low: number, high: number): boolean {
  return low <= x && x <= high;
}

// https://github.com/processing/p5.js/blob/v1.4.1/src/math/calculation.js#L409
export function mapRange(
  x: number,
  s1: number,
  e1: number,
  s2: number,
  e2: number,
  clamp = false
): number {
  const newx = ((x - s1) / (e1 - s1)) * (e2 - s2) + s2;
  if (!clamp) return newx;
  if (s2 < e2) {
    return clampRange(newx, s2, e2);
  } else {
    return clampRange(newx, e2, s2);
  }
}

export type ScalingFn = (mag: number) => number; // returns the length of arrow in pixels
export type InverseScalingFn = (length: number) => number; // returns the magnitude

export function makeSqrtScalingFn(k: number): ScalingFn {
  return (mag: number) => mapRange(Math.sqrt(mag / k), 0, 5, 20, 80);
}

export function makeInverseSqrtScalingFn(k: number): InverseScalingFn {
  return (length: number) => mapRange(length, 20, 80, 0, 5) ** 2 * k;
}

// }}}

export function sgn(x: number, zeroValue = 0): number {
  if (x > 0) return 1;
  if (x < 0) return -1;
  return zeroValue;
}

export function approxEq(a: number, b: number, plusminus: number): boolean {
  return Math.abs(a - b) < plusminus;
}

// {{{ geometry

// returns true if it intersects
export function circlePointIntersection(
  circlePos: Vec2,
  radius: number,
  point: Vec2
): boolean {
  return circlePos.sub(point).magSq() < radius * radius;
}

// }}}

// {{{ colourful stuffs
// adapted from https://gist.github.com/nikolas/b0cce2261f1382159b507dd492e1ceef
export function lerpColor(a: number, b: number, amt: number): number {
  const ar = a >> 16,
    ag = (a >> 8) & 0xff,
    ab = a & 0xff;
  const br = b >> 16,
    bg = (b >> 8) & 0xff,
    bb = b & 0xff;
  const rr = ar + amt * (br - ar),
    rg = ag + amt * (bg - ag),
    rb = ab + amt * (bb - ab);

  return ((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0;
}

// https://stackoverflow.com/a/141943/13181476
export function lightenHexColor(color: number, strength: number): number {
  const originalColor = PIXI.utils.hex2rgb(color) as [number, number, number];
  const [r, g, b] = originalColor.map((v) => v * (1 + strength));

  const threshold = 0.999;
  const max = Math.max(r, g, b);
  if (max <= threshold) {
    return PIXI.utils.rgb2hex(originalColor);
  }
  const total = r + g + b;
  if (total >= threshold * 3) {
    return PIXI.utils.rgb2hex([threshold, threshold, threshold]);
  }
  const x = (3 * threshold - total) / (3 * max - total);
  const gray = threshold - x * max;
  return PIXI.utils.rgb2hex([gray + x * r, gray + x * g, gray + x * b]);
}
// }}}

// {{{ ellipse
export class EllipseData {
  centre: Vec2;
  semiMajorAxis: number;
  semiMinorAxis: number;

  constructor(centre: Vec2, semiMajorAxis: number, semiMinorAxis: number) {
    this.centre = centre;
    this.semiMajorAxis = semiMajorAxis;
    this.semiMinorAxis = semiMinorAxis;
  }

  static fromFocus(
    centre: Vec2,
    linearEccentricity: number,
    semiMajorAxis: number
  ): EllipseData {
    const semiMinorAxis = Math.sqrt(
      semiMajorAxis * semiMajorAxis - linearEccentricity * linearEccentricity
    );
    return new EllipseData(centre, semiMajorAxis, semiMinorAxis);
  }

  // angle from the VERTICAL
  pointAtAngle(angle: number): Vec2 {
    angle *= -1;
    return this.centre.sub(
      new Vec2(
        this.semiMajorAxis * Math.sin(angle),
        this.semiMinorAxis * Math.cos(angle)
      )
    );
  }

  angleAtPoint(point: Vec2): number {
    return point.sub(this.centre).angle();
  }

  tangentAngleAtAngle(angle: number): number {
    angle *= -1;
    return Math.atan(
      -(this.semiMinorAxis * Math.cos(angle)) /
        (this.semiMajorAxis * Math.sin(angle))
    );
  }

  // basically vis-viva equatino
  calculateOrbitalVel(angle: number, mu: number, r: number): Vec2 {
    const a = this.semiMajorAxis;
    const velMag = Math.sqrt(mu * (2 / r - 1 / a));
    const velAngle = this.tangentAngleAtAngle(angle);
    return Vec2.fromPolar(velMag, velAngle);
  }

  get eccentricity(): number {
    return Math.sqrt(
      1 -
        (this.semiMinorAxis * this.semiMinorAxis) /
          (this.semiMajorAxis * this.semiMajorAxis)
    );
  }

  get linearEccentricity(): number {
    return Math.sqrt(
      this.semiMajorAxis * this.semiMajorAxis -
        this.semiMinorAxis * this.semiMinorAxis
    );
  }

  get leftFocus(): Vec2 {
    return this.centre.addX(-this.linearEccentricity);
  }

  get rightFocus(): Vec2 {
    return this.centre.addX(this.linearEccentricity);
  }

  get leftVertex(): Vec2 {
    return this.centre.addX(-this.semiMajorAxis);
  }

  get rightVertex(): Vec2 {
    return this.centre.addX(this.semiMajorAxis);
  }

  // assume that the centre body is at one of the foci
  get apoapsisDist(): number {
    return this.semiMajorAxis * (1 + this.eccentricity);
  }

  // assume that the centre body is at one of the foci
  get periapsisDist(): number {
    return this.semiMajorAxis * (1 - this.eccentricity);
  }
}
// }}}

// {{{ multivariable calculus baby wooohooo!!!
export type VectorField = (inpt: Vec2) => Vec2 | undefined;
export type ScalarField = (inpt: Vec2) => number | undefined;
const SMOL_QUANTITY = 1e-5;

// evaluate the gradient of a scalar field at a particular pos numerically
// export function gradient(f: ScalarField, pos: Vec2): Vec2 {
//   const pdx = partialDerivative(f, "x", pos);
//   const pdy = partialDerivative(f, "y", pos);
//   return new Vec2(pdx, pdy);
// }

// approximate the divergence of a vector field at a particular position numerically
export function divergence(
  f: VectorField,
  pos: Vec2,
  delta = SMOL_QUANTITY
): number | undefined {
  const fx: ScalarField = (inpt: Vec2) => f(inpt)?.x;
  const fy: ScalarField = (inpt: Vec2) => f(inpt)?.y;
  const dfx_dx = partialDerivative(fx, "x", pos, delta);
  const dfy_dy = partialDerivative(fy, "y", pos, delta);
  if (!dfx_dx || !dfy_dy) return undefined;
  return dfx_dx + dfy_dy;
}

export function partialDerivative(
  f: ScalarField,
  wrt: "x" | "y",
  pos: Vec2,
  delta = SMOL_QUANTITY
): number | undefined {
  const dir = wrt == "x" ? Vec2.RIGHT : Vec2.UP;
  const f1 = f(pos);
  const f2 = f(pos.add(dir.setMag(delta)));
  if (!f1 || !f2) return undefined;
  const df = f2 - f1;
  return df / delta;
}
// }}}
