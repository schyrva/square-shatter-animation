import { Fragment, Point } from '../types/types';
import { STROKE_STYLE, LINE_WIDTH } from '../constants/config';

// Draws a single fragment with scaling animation
// Scales the fragment from its centroid relative to the square center
export function drawFragment(
  ctx: CanvasRenderingContext2D,
  fragment: Fragment,
  scale: number,
  squareCenter: Point
): void {
  const cx = squareCenter.x + scale * (fragment.centroid.x - squareCenter.x);
  const cy = squareCenter.y + scale * (fragment.centroid.y - squareCenter.y);

  ctx.beginPath();
  fragment.localOffsets.forEach((offset, i) => {
    const vx = cx + offset.x;
    const vy = cy + offset.y;
    if (i === 0) ctx.moveTo(vx, vy);
    else ctx.lineTo(vx, vy);
  });

  ctx.closePath();
  ctx.fillStyle = fragment.color;
  ctx.fill();

  ctx.strokeStyle = STROKE_STYLE;
  ctx.lineWidth = LINE_WIDTH;
  ctx.stroke();
}
