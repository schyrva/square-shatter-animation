import { Point, Polygon } from "../types/types";

/**
 * Determines which side of a line (p1 → p2) a point p0 is on.
 * Returns:
 *   - 1  → if p0 is to the left of the line.
 *   - -1 → if p0 is to the right of the line.
 *   - 0  → if p0 lies exactly on the line.
 */
export function lineSide(p1: Point, p2: Point, p0: Point): number {
  const result = (p2.x - p1.x) * (p0.y - p1.y) - (p2.y - p1.y) * (p0.x - p1.x);

  switch (true) {
    case result > 0:
      return 1;
    case result < 0:
      return -1;
    default:
      return 0;
  }
}

/**
 * Finds the intersection point of two line segments (p1 → p2) and (p3 → p4).
 * Returns:
 *   - The intersection point if they overlap.
 *   - Null if the segments do not intersect.
 */
export function segmentIntersection(
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point
): Point | null {
  const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);

  if (Math.abs(denom) < 1e-9) {
    return null;
  }

  const ua =
    ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
  const ub =
    ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;

  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return null;
  }

  return {
    x: p1.x + ua * (p2.x - p1.x),
    y: p1.y + ua * (p2.y - p1.y),
  };
}

/**
 * Calculates the geometric center (centroid) of a polygon.
 */
export function computeCentroid(polygon: Polygon): Point {
  let sumX = 0;
  let sumY = 0;

  for (const p of polygon) {
    sumX += p.x;
    sumY += p.y;
  }

  return {
    x: sumX / polygon.length,
    y: sumY / polygon.length,
  };
}

/**
 * Calculates the area of a polygon using the shoelace formula.
 */
export function polygonArea(polygon: Polygon): number {
  let area = 0;

  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    area += polygon[i].x * polygon[j].y - polygon[j].x * polygon[i].y;
  }

  return Math.abs(area) / 2;
}

/**
 * Splits a polygon into two parts using a line.
 * If the line does not intersect the polygon, returns the original polygon.
 */
export function cutPolygonWithLine(
  polygon: Polygon,
  p1: Point,
  p2: Point
): Polygon[] {
  const polyA: Polygon = [];
  const polyB: Polygon = [];

  for (let i = 0; i < polygon.length; i++) {
    const current = polygon[i];
    const next = polygon[(i + 1) % polygon.length];
    const sideCurrent = lineSide(p1, p2, current);

    switch (sideCurrent) {
      case 1:
        polyA.push(current);
        break;
      case -1:
        polyB.push(current);
        break;
      case 0:
        polyA.push(current);
        polyB.push(current);
        break;
    }

    const intersect = segmentIntersection(current, next, p1, p2);
    if (intersect) {
      polyA.push(intersect);
      polyB.push(intersect);
    }
  }

  if (polyA.length === 0 || polyB.length === 0) {
    return [polygon];
  }

  return [polyA, polyB];
}
