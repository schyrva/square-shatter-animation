import { Fragment, Point } from "../types/types";
import { STROKE_STYLE, LINE_WIDTH } from "../constants/config";

/**
 * Draws a single fragment with scaling animation.
 * Scales the fragment around its centroid, relative to the square center.
 */
export function drawFragment(
  ctx: CanvasRenderingContext2D,
  fragment: Fragment,
  scale: number,
  squareCenter: Point
): void {
  // Calculate the scaled centroid position
  const scaledX = squareCenter.x + scale * (fragment.centroid.x - squareCenter.x);
  const scaledY = squareCenter.y + scale * (fragment.centroid.y - squareCenter.y);

  ctx.beginPath();

  // Plot the fragment's vertices using precomputed local offsets
  fragment.localOffsets.forEach((offset, index) => {
    const vx = scaledX + offset.x;
    const vy = scaledY + offset.y;

    if (index === 0) {
      ctx.moveTo(vx, vy);
    } else {
      ctx.lineTo(vx, vy);
    }
  });

  ctx.closePath();

  // Apply fill and stroke styles
  ctx.fillStyle = fragment.color;
  ctx.fill();

  ctx.strokeStyle = STROKE_STYLE;
  ctx.lineWidth = LINE_WIDTH;
  ctx.stroke();
}
