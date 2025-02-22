interface Point {
  x: number;
  y: number;
}

type Polygon = Point[];
type Line = [Point, Point];

interface Fragment {
  vertices: Point[];
  centroid: Point;
  color: string;
}

let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d")!;

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let innerSquareSize: number;
let offsetX: number;
let offsetY: number;
let squareCenter: Point;

let fragments: Fragment[] = [];
let subdivisionGenerated = false;

const SPEED = 0.02;
const MAX_SCALE = 4.0;
const AREA_THRESHOLD = 3;
const MIN_LINES = 1;
const MAX_LINES = 20;

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

function cutPolygonWithLine(polygon: Polygon, p1: Point, p2: Point): Polygon[] {
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

function cutPolygonsWithLine(polygons: Polygon[], p1: Point, p2: Point): Polygon[] {
  let result: Polygon[] = [];
  for (const poly of polygons) {
    result = result.concat(cutPolygonWithLine(poly, p1, p2));
  }
  return result;
}

function computeCentroid(polygon: Polygon): Point {
  let sumX = 0, sumY = 0;
  for (const p of polygon) {
    sumX += p.x;
    sumY += p.y;
  }
  return { x: sumX / polygon.length, y: sumY / polygon.length };
}

function polygonArea(polygon: Polygon): number {
  let area = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    area += polygon[i].x * polygon[j].y - polygon[j].x * polygon[i].y;
  }
  return Math.abs(area) / 2;
}

function polygonsToFragments(polygons: Polygon[]): Fragment[] {
  return polygons
    .filter(poly => poly.length >= 3 && polygonArea(poly) > AREA_THRESHOLD)
    .map(poly => ({
      vertices: poly,
      centroid: computeCentroid(poly),
      color: getRandomColor()
    }));
}

function resizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const minDimension = Math.min(canvasWidth, canvasHeight);
  innerSquareSize = minDimension / 4;
  offsetX = (canvasWidth - innerSquareSize) / 2;
  offsetY = (canvasHeight - innerSquareSize) / 2;
  squareCenter = { x: offsetX + innerSquareSize / 2, y: offsetY + innerSquareSize / 2 };
  createSubdivision();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createSubdivision() {
  let polygons: Polygon[] = [[
    { x: offsetX, y: offsetY },
    { x: offsetX + innerSquareSize, y: offsetY },
    { x: offsetX + innerSquareSize, y: offsetY + innerSquareSize },
    { x: offsetX, y: offsetY + innerSquareSize }
  ]];
  const lineCount = Math.floor(Math.random() * (MAX_LINES - MIN_LINES + 1)) + MIN_LINES;
  const lines = generateRandomLines(lineCount, innerSquareSize);
  const adjustedLines = lines.map(([p1, p2]) => ([
    { x: p1.x + offsetX, y: p1.y + offsetY },
    { x: p2.x + offsetX, y: p2.y + offsetY }
  ]) as Line);
  for (const [p1, p2] of adjustedLines) {
    polygons = cutPolygonsWithLine(polygons, p1, p2);
  }
  fragments = polygonsToFragments(polygons);
}

function getRandomColor(): string {
  const r = Math.floor(100 + Math.random() * 155);
  const g = Math.floor(100 + Math.random() * 155);
  const b = Math.floor(100 + Math.random() * 155);
  return `rgb(${r}, ${g}, ${b})`;
}

let scale = 1.0;
let growing = true;

function animate() {
  requestAnimationFrame(animate);
  if (growing) {
    scale += SPEED;
    if (scale >= MAX_SCALE) {
      scale = MAX_SCALE;
      growing = false;
    }
  } else {
    scale -= SPEED;
    if (scale <= 1.0) {
      scale = 1.0;
      growing = true;
      if (!subdivisionGenerated) {
        createSubdivision();
        subdivisionGenerated = true;
      }
    }
  }
  if (scale > 1.0) subdivisionGenerated = false;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  fragments.forEach(frag => drawFragment(frag, scale));
}

requestAnimationFrame(animate);

function drawFragment(fragment: Fragment, s: number) {
  const cx = squareCenter.x + s * (fragment.centroid.x - squareCenter.x);
  const cy = squareCenter.y + s * (fragment.centroid.y - squareCenter.y);
  ctx.beginPath();
  fragment.vertices.forEach((v, i) => {
    const localOffsetX = v.x - fragment.centroid.x;
    const localOffsetY = v.y - fragment.centroid.y;
    const vx = cx + localOffsetX;
    const vy = cy + localOffsetY;
    if (i === 0) ctx.moveTo(vx, vy);
    else ctx.lineTo(vx, vy);
  });
  ctx.closePath();
  ctx.fillStyle = fragment.color;
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.stroke();
}
