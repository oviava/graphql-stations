// we use this to create a point in the database
export class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toSqlString() {
    return `POINT(${this.x},${this.y})`;
  }

  // could maybe go to something like is near and group them within a certain distance
  isEqual(point: Point) {
    return this.x === point.x && this.y === point.y;
  }
}
