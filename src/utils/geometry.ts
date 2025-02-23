import { Point, Polygon } from '../types/types';

// Determines which side of a line a point is on
// Returns positive if point is on left side, negative if on right side, 0 if on the line
export function lineSide(p1: Point, p2: Point, p0: Point): number {
  return (p2.x - p1.x) * (p0.y - p1.y) - (p2.y - p1.y) * (p0.x - p1.x);
}

// Finds intersection point of two line segments
// Returns null if segments don't intersect
export function segmentIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
  const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (Math.abs(denom) < 1e-9) return null;

  const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
  const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;

  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return null;
  return { x: p1.x + ua * (p2.x - p1.x), y: p1.y + ua * (p2.y - p1.y) };
}

// Calculates geometric center (centroid) of a polygon
export function computeCentroid(polygon: Polygon): Point {
  let sumX = 0,
    sumY = 0;
  for (const p of polygon) {
    sumX += p.x;
    sumY += p.y;
  }
  return { x: sumX / polygon.length, y: sumY / polygon.length };
}

// Calculates area of a polygon using the shoelace formula
export function polygonArea(polygon: Polygon): number {
  let area = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    area += polygon[i].x * polygon[j].y - polygon[j].x * polygon[i].y;
  }
  return Math.abs(area) / 2;
}

// Splits a polygon into two parts using a line
// Returns original polygon if line doesn't intersect it
export function cutPolygonWithLine(polygon: Polygon, p1: Point, p2: Point): Polygon[] {
  const polyA: Polygon = [];
  const polyB: Polygon = [];

  for (let i = 0; i < polygon.length; i++) {
    const current = polygon[i];
    const next = polygon[(i + 1) % polygon.length];
    const sideCurrent = lineSide(p1, p2, current);

    if (sideCurrent >= 0) polyA.push(current);
    if (sideCurrent <= 0) polyB.push(current);

    const intersect = segmentIntersection(current, next, p1, p2);
    if (intersect) {
      polyA.push(intersect);
      polyB.push(intersect);
    }
  }

  return polyA.length === 0 || polyB.length === 0 ? [polygon] : [polyA, polyB];
}
