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
  // Calculate scaled centroid position
  const cx = squareCenter.x + scale * (fragment.centroid.x - squareCenter.x);
  const cy = squareCenter.y + scale * (fragment.centroid.y - squareCenter.y);

  // Draw the fragment path
  ctx.beginPath();
  fragment.vertices.forEach((v, i) => {
    // Calculate vertex position relative to the scaled centroid
    const localOffsetX = v.x - fragment.centroid.x;
    const localOffsetY = v.y - fragment.centroid.y;
    const vx = cx + localOffsetX;
    const vy = cy + localOffsetY;
    i === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
  });

  // Apply fill and stroke styles
  ctx.closePath();
  ctx.fillStyle = fragment.color;
  ctx.fill();
  ctx.strokeStyle = STROKE_STYLE;
  ctx.lineWidth = LINE_WIDTH;
  ctx.stroke();
}
