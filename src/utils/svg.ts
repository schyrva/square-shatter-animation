import { Fragment, Point } from '../types/types';
import { STROKE_STYLE, LINE_WIDTH } from '../constants/config';

/**
 * Creates an SVG polygon element for a fragment
 */
export function createSvgFragment(
  fragment: Fragment,
  scale: number,
  squareCenter: Point
): SVGPolygonElement {
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

  // Calculate the scaled centroid position
  const scaledX = squareCenter.x + scale * (fragment.centroid.x - squareCenter.x);
  const scaledY = squareCenter.y + scale * (fragment.centroid.y - squareCenter.y);

  // Generate points attribute string
  const points = fragment.localOffsets
    .map((offset) => {
      const vx = scaledX + offset.x;
      const vy = scaledY + offset.y;
      return `${vx},${vy}`;
    })
    .join(' ');

  // Set attributes
  polygon.setAttribute('points', points);
  polygon.setAttribute('fill', fragment.color);
  polygon.setAttribute('stroke', STROKE_STYLE);
  polygon.setAttribute('stroke-width', LINE_WIDTH.toString());

  return polygon;
}

/**
 * Updates an existing SVG polygon element for a fragment
 */
export function updateSvgFragment(
  polygon: SVGPolygonElement,
  fragment: Fragment,
  scale: number,
  squareCenter: Point
): void {
  // Calculate the scaled centroid position
  const scaledX = squareCenter.x + scale * (fragment.centroid.x - squareCenter.x);
  const scaledY = squareCenter.y + scale * (fragment.centroid.y - squareCenter.y);

  // Generate points attribute string
  const points = fragment.localOffsets
    .map((offset) => {
      const vx = scaledX + offset.x;
      const vy = scaledY + offset.y;
      return `${vx},${vy}`;
    })
    .join(' ');

  // Update points attribute
  polygon.setAttribute('points', points);
}

/**
 * Clears all elements from the SVG
 */
export function clearSvg(svg: SVGSVGElement): void {
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }
}
