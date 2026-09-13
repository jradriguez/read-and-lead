import type { Catalog } from "./types";
import { reviewPayload } from "./review";
export async function verifyRuntimeReview(
  catalog: Catalog,
  hash: (text: string) => Promise<string>,
): Promise<void> {
  const digest = await hash(reviewPayload(catalog));
  if (
    catalog.lessons.some(
      (l) => l.review.state !== "approved" || l.review.digest !== digest,
    )
  )
    throw new Error("CONTENT_REVIEW_REQUIRED");
}
