import type { Catalog } from "./types";
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.keys(value)
      .filter((k) => (value as Record<string, unknown>)[k] !== undefined)
      .sort()
      .map(
        (k) =>
          `${JSON.stringify(k)}:${canonical((value as Record<string, unknown>)[k])}`,
      )
      .join(",")}}`;
  return JSON.stringify(value);
}
// Whole-pack binding: any content, attribution or asset hash change requires a new review.
export function reviewPayload(c: Catalog): string {
  return canonical({
    ...c,
    lessons: c.lessons.map((l) => ({ ...l, review: undefined })),
    assets: c.assets.map((a) => ({ ...a, reviewed: undefined })),
  });
}
