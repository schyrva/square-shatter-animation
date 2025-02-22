export interface Point {
  x: number;
  y: number;
}

export type Polygon = Point[];
export type Line = [Point, Point];

export interface Fragment {
  vertices: Point[];
  centroid: Point;
  color: string;
}
