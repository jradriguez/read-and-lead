import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { makeCatalog } from "./fixtures/catalog.ts";
import { reviewPayload } from "../src/content/review.ts";
import { verifyRuntimeReview } from "../src/content/runtime-review.ts";
const hash = async (s: string) => createHash("sha256").update(s).digest("hex");
test("runtime refuses a changed catalog even if its approval labels remain", async () => {
  const c = makeCatalog();
  const digest = await hash(reviewPayload(c));
  c.lessons.forEach((l) => {
    l.review = { state: "approved", reviewer: "test-reviewer", digest };
  });
  await verifyRuntimeReview(c, hash);
  c.lessons[0].title = "Changed after review";
  await assert.rejects(verifyRuntimeReview(c, hash), /CONTENT_REVIEW_REQUIRED/);
});
