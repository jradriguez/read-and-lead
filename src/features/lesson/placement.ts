export function placeTile(
  slots: (string | null)[],
  patternId: string,
  index: number,
): (string | null)[] {
  if (!Number.isInteger(index) || index < 0 || index >= slots.length)
    return slots;
  const result = [...slots];
  result[index] = patternId;
  return result;
}
export type Bounds = { x: number; y: number; width: number; height: number };
export function dropIndex(x: number, y: number, bounds: Bounds[]): number {
  return bounds.findIndex(
    (b) =>
      b &&
      b.width > 0 &&
      b.height > 0 &&
      x >= b.x &&
      x < b.x + b.width &&
      y >= b.y &&
      y < b.y + b.height,
  );
}
