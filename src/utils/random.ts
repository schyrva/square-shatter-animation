import { Point, Line } from '../types/types';
import { MIN_RGB, COLOR_RANGE } from '../constants/config';

export function getRandomBoundaryPoint(size: number): Point {
  const side = Math.floor(Math.random() * 4);
  const pos = Math.random() * size;

  if (side === 0) return { x: pos, y: 0 };
  if (side === 1) return { x: size, y: pos };
  if (side === 2) return { x: pos, y: size };
  return { x: 0, y: pos };
}

export function generateRandomLines(count: number, size: number): Line[] {
  const lines: Line[] = [];
  for (let i = 0; i < count; i++) {
    const p1 = getRandomBoundaryPoint(size);
    const p2 = getRandomBoundaryPoint(size);
    lines.push([p1, p2]);
  }
  return lines;
}

export function getRandomColor(): string {
  const r = Math.floor(MIN_RGB + Math.random() * COLOR_RANGE);
  const g = Math.floor(MIN_RGB + Math.random() * COLOR_RANGE);
  const b = Math.floor(MIN_RGB + Math.random() * COLOR_RANGE);
  return `rgb(${r}, ${g}, ${b})`;
}
