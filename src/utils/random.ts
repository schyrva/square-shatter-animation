import { Point, Line } from "../types/types";
import { MIN_RGB, COLOR_RANGE } from "../constants/config";

/**
 * Generates a random point on the square boundary.
 * The boundary sides are indexed as:
 *   - 0 = Top
 *   - 1 = Right
 *   - 2 = Bottom
 *   - 3 = Left
 */
export function getRandomBoundaryPoint(size: number): Point {
  const side = Math.floor(Math.random() * 4);
  const pos = Math.random() * size;

  switch (side) {
    case 0:
      return { x: pos, y: 0 };
    case 1:
      return { x: size, y: pos };
    case 2:
      return { x: pos, y: size };
    case 3:
    default:
      return { x: 0, y: pos };
  }
}

/**
 * Generates an array of random lines between boundary points.
 */
export function generateRandomLines(count: number, size: number): Line[] {
  const lines: Line[] = [];

  for (let i = 0; i < count; i++) {
    const p1 = getRandomBoundaryPoint(size);
    const p2 = getRandomBoundaryPoint(size);
    lines.push([p1, p2]);
  }

  return lines;
}

/**
 * Generates a random RGB color string within the configured range.
 */
export function getRandomColor(): string {
  const r = Math.floor(MIN_RGB + Math.random() * COLOR_RANGE);
  const g = Math.floor(MIN_RGB + Math.random() * COLOR_RANGE);
  const b = Math.floor(MIN_RGB + Math.random() * COLOR_RANGE);

  return `rgb(${r}, ${g}, ${b})`;
}
