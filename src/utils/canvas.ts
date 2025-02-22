import { Fragment, Point } from '../types/types';
import { STROKE_STYLE, LINE_WIDTH } from '../constants/config';

export function drawFragment(
  ctx: CanvasRenderingContext2D,
  fragment: Fragment,
  scale: number,
  squareCenter: Point
): void {
  const cx = squareCenter.x + scale * (fragment.centroid.x - squareCenter.x);
  const cy = squareCenter.y + scale * (fragment.centroid.y - squareCenter.y);

  ctx.beginPath();
  fragment.vertices.forEach((v, i) => {
    const localOffsetX = v.x - fragment.centroid.x;
    const localOffsetY = v.y - fragment.centroid.y;
    const vx = cx + localOffsetX;
    const vy = cy + localOffsetY;
    i === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
  });

  ctx.closePath();
  ctx.fillStyle = fragment.color;
  ctx.fill();
  ctx.strokeStyle = STROKE_STYLE;
  ctx.lineWidth = LINE_WIDTH;
  ctx.stroke();
}
