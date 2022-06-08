import * as PIXI from "pixi.js";
import ParticleComponent from "../Components/ParticleComponent";
import PixiContainerComponent from "../Components/PIXIContainerComponent";
import Vec2 from "../Vec2";

export function updatePixiContainer(
  pixiContainerComponent: PixiContainerComponent,
  particleComponent: ParticleComponent,
  scaleFactor: number
) {
  pixiContainerComponent.container.x = particleComponent.pos.x * scaleFactor;
  pixiContainerComponent.container.y = particleComponent.pos.y * scaleFactor;
}

export function updateParticleComponent(
  pixiContainerComponent: PixiContainerComponent,
  particleComponent: ParticleComponent,
  scaleFactor: number
) {
  particleComponent.pos.x = pixiContainerComponent.container.x / scaleFactor;
  particleComponent.pos.y = pixiContainerComponent.container.y / scaleFactor;
}

export function updateArrowGraphic(
  length: number,
  arrowGraphic: PIXI.Graphics,
  {
    arrowWidth,
    arrowheadWidth,
    arrowheadHeight,
    centre = "bottom",
  }: {
    arrowWidth: number;
    arrowheadWidth: number;
    arrowheadHeight: number;
    centre?: "bottom" | "middle";
  }
): void {
  const offset = centre == "bottom" ? 0 : -(length + arrowheadHeight);
  arrowGraphic.drawRect(-arrowWidth / 2, -length + offset, arrowWidth, length);
  arrowGraphic.drawPolygon([
    new PIXI.Point(-arrowheadWidth / 2, -length + offset),
    new PIXI.Point(arrowheadWidth / 2, -length + offset),
    new PIXI.Point(0, -length - arrowheadHeight + offset),
  ]);
}

// FIXME: Uncaught TypeError: can't access property "x", pts[0] is undefined when something goes out of frame
// https://stackoverflow.com/a/15528789/13181476
export function smoothCurveThroughPoints(
  ctx: CanvasRenderingContext2D,
  pts: Vec2[],
  tension?: number,
  isClosed?: boolean,
  numOfSegments?: number
): void {
  ctx.beginPath();

  drawLines(ctx, getCurvePoints(pts, tension, isClosed, numOfSegments));
}

function getCurvePoints(
  pts: Vec2[],
  tension = 0.5,
  isClosed = false,
  numOfSegments = 5
): Vec2[] {
  let _pts: number[] = [],
    res: number[] = [], // clone array
    x,
    y, // our x,y coords
    t1x,
    t2x,
    t1y,
    t2y, // tension vectors
    c1,
    c2,
    c3,
    c4, // cardinal points
    st,
    t,
    i; // steps based on num. of segments

  // clone array so we don't change the original
  // * adapted cuz the pts array was supposed to be [x1, y1, x2, y2, ...]
  // * but now i'm passing in [ {x: x1, y: y1}, {x: x2, y: y2}, ...]
  _pts = pts.flatMap((v) => [v.x, v.y]);

  // The algorithm require a previous and next point to the actual point array.
  // Check if we will draw closed or open curve.
  // If closed, copy end points to beginning and first points to end
  // If open, duplicate first points to befinning, end points to end
  if (isClosed) {
    _pts.unshift(pts[pts.length - 1].y); // * these are modified as well, see note above
    _pts.unshift(pts[pts.length - 1].x);
    _pts.unshift(pts[pts.length - 1].y);
    _pts.unshift(pts[pts.length - 1].x);
    _pts.push(pts[0].x);
    _pts.push(pts[0].y);
  } else {
    _pts.unshift(pts[0].y); //copy 1. point and insert at beginning
    _pts.unshift(pts[0].x);
    _pts.push(pts[pts.length - 1].x); //copy last point and append
    _pts.push(pts[pts.length - 1].y);
  }

  // ok, lets start..

  // 1. loop goes through point array
  // 2. loop goes through each segment between the 2 pts + 1e point before and after
  for (i = 2; i < _pts.length - 4; i += 2) {
    for (t = 0; t <= numOfSegments; t++) {
      // calc tension vectors
      t1x = (_pts[i + 2] - _pts[i - 2]) * tension;
      t2x = (_pts[i + 4] - _pts[i]) * tension;

      t1y = (_pts[i + 3] - _pts[i - 1]) * tension;
      t2y = (_pts[i + 5] - _pts[i + 1]) * tension;

      // calc step
      st = t / numOfSegments;

      // calc cardinals
      c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
      c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
      c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
      c4 = Math.pow(st, 3) - Math.pow(st, 2);

      // calc x and y cords with common control vectors
      x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x;
      y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y;

      //store points in array
      res.push(x);
      res.push(y);
    }
  }

  return res.flatMap((_, idx) =>
    idx == res.length - 1 || idx % 2 == 1
      ? []
      : new Vec2(res[idx], res[idx + 1])
  ); // * modified to turn it back into Vec2[]
}

export function drawLines(ctx: CanvasRenderingContext2D, pts: Vec2[]) {
  ctx.moveTo(pts[0].x, pts[0].y);
  for (const pt of pts) ctx.lineTo(pt.x, pt.y);
}
