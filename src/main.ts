import { Point, Fragment, Polygon } from './types/types';
import { SPEED, MAX_SCALE, AREA_THRESHOLD, MIN_LINES, MAX_LINES } from './constants/config';
import { cutPolygonWithLine, computeCentroid, polygonArea } from './utils/geometry';
import { generateRandomLines, getRandomColor } from './utils/random';
import { drawFragment } from './utils/canvas';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
let innerSquareSize: number;
let offsetX: number;
let offsetY: number;
let squareCenter: Point;
let fragments: Fragment[] = [];
let subdivisionGenerated = false;
let scale = 1.0;
let growing = true;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

function cutPolygonsWithLine(polygons: Polygon[], p1: Point, p2: Point): Polygon[] {
  let result: Polygon[] = [];
  for (const poly of polygons) {
    result = result.concat(cutPolygonWithLine(poly, p1, p2));
  }
  return result;
}

function polygonsToFragments(polygons: Polygon[]): Fragment[] {
  return polygons
    .filter((poly) => poly.length >= 3 && polygonArea(poly) > AREA_THRESHOLD)
    .map((poly) => ({
      vertices: poly,
      centroid: computeCentroid(poly),
      color: getRandomColor(),
    }));
}

function createSubdivision(): void {
  let polygons: Polygon[] = [
    [
      { x: offsetX, y: offsetY },
      { x: offsetX + innerSquareSize, y: offsetY },
      { x: offsetX + innerSquareSize, y: offsetY + innerSquareSize },
      { x: offsetX, y: offsetY + innerSquareSize },
    ],
  ];

  const lineCount = Math.floor(Math.random() * (MAX_LINES - MIN_LINES + 1)) + MIN_LINES;
  const lines = generateRandomLines(lineCount, innerSquareSize);

  const adjustedLines = lines.map(([p1, p2]) => [
    { x: p1.x + offsetX, y: p1.y + offsetY },
    { x: p2.x + offsetX, y: p2.y + offsetY },
  ]);

  for (const [p1, p2] of adjustedLines) {
    polygons = cutPolygonsWithLine(polygons, p1, p2);
  }

  fragments = polygonsToFragments(polygons);
}

function resizeCanvas(): void {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const minDimension = Math.min(canvasWidth, canvasHeight);
  innerSquareSize = minDimension / 4;
  offsetX = (canvasWidth - innerSquareSize) / 2;
  offsetY = (canvasHeight - innerSquareSize) / 2;
  squareCenter = {
    x: offsetX + innerSquareSize / 2,
    y: offsetY + innerSquareSize / 2,
  };

  createSubdivision();
}

function animate(): void {
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
  fragments.forEach((frag) => drawFragment(ctx, frag, scale, squareCenter));
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
requestAnimationFrame(animate);
