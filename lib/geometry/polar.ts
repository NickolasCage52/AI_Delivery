type Point = { x: number; y: number };

export function polarToCartesian(center: Point, radius: number, angleRad: number): Point {
  return {
    x: center.x + radius * Math.cos(angleRad),
    y: center.y + radius * Math.sin(angleRad),
  };
}
