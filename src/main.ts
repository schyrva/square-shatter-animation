let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

interface Point {
  x: number;
  y: number;
}

type Polygon = Point[];
type Line = [Point, Point];

function getRandomBoundaryPoint(size: number): Point {
  const side = Math.floor(Math.random() * 4);
  const pos = Math.random() * size;
  if (side === 0) return { x: pos, y: 0 };
  if (side === 1) return { x: size, y: pos };
  if (side === 2) return { x: pos, y: size };
  return { x: 0, y: pos };
}

function generateRandomLines(count: number, size: number): Line[] {
  const lines: Line[] = [];
  for (let i = 0; i < count; i++) {
    const p1 = getRandomBoundaryPoint(size);
    const p2 = getRandomBoundaryPoint(size);
    lines.push([p1, p2]);
  }
  return lines;
}

function lineSide(p1: Point, p2: Point, p0: Point): number {
  return (p2.x - p1.x) * (p0.y - p1.y) - (p2.y - p1.y) * (p0.x - p1.x);
}

function segmentIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
  const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (Math.abs(denom) < 1e-9) return null;
  const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
  const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return null;
  return { x: p1.x + ua * (p2.x - p1.x), y: p1.y + ua * (p2.y - p1.y) };
}
