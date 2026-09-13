import { readFileSync, lstatSync, realpathSync } from "node:fs";
import { createHash } from "node:crypto";
import { validateCatalog } from "../src/content/validate";
import { reviewPayload } from "../src/content/review";
import { resolve } from "node:path";
import type { Catalog } from "../src/content/types";
import { renderAudioSources } from "./audio-sources";
export function checkContent(
  root: string,
  catalog: Catalog,
  release: boolean,
): string[] {
  const errors = validateCatalog(catalog, release);
  for (const asset of catalog.assets) {
    const parts = asset.file.split("/");
    if (
      parts.some((p) => !p || p === "." || p === "..") ||
      asset.file.includes("\\")
    ) {
      errors.push(`ASSET_PATH:${asset.id}`);
      continue;
    }
    const base = resolve(root, "assets");
    const file = resolve(base, asset.file);
    if (!file.startsWith(base + "/")) {
      errors.push(`ASSET_PATH:${asset.id}`);
      continue;
    }
    try {
      if (
        parts.some((_, i) =>
          lstatSync(resolve(base, ...parts.slice(0, i + 1))).isSymbolicLink(),
        ) ||
        !realpathSync(file).startsWith(realpathSync(base) + "/")
      ) {
        errors.push(`ASSET_PATH:${asset.id}`);
        continue;
      }
      const bytes = readFileSync(file);
      if (!bytes.length) errors.push(`ASSET_EMPTY:${asset.id}`);
      if (createHash("sha256").update(bytes).digest("hex") !== asset.sha256)
        errors.push(`ASSET_HASH:${asset.id}`);
    } catch {
      errors.push(`ASSET_MISSING:${asset.id}`);
    }
  }
  if (release) {
    try {
      const map = resolve(root, "src/audio/draft-sources.ts");
      if (
        lstatSync(map).isSymbolicLink() ||
        readFileSync(map, "utf8") !== renderAudioSources(catalog)
      )
        errors.push("AUDIO_MAP_MISMATCH");
    } catch {
      errors.push("AUDIO_MAP_MISSING");
    }
    const digest = createHash("sha256")
      .update(reviewPayload(catalog))
      .digest("hex");
    catalog.lessons.forEach((l) => {
      if (l.review.digest !== digest) errors.push(`REVIEW_DIGEST:${l.id}`);
    });
  }
  return errors;
}
if (process.argv[1]?.endsWith("check-content.ts")) {
  const root = resolve(
    process.argv[2] && !process.argv[2].startsWith("--")
      ? process.argv[2]
      : ".",
  );
  const catalog = JSON.parse(
    readFileSync(resolve(root, "content/catalog.json"), "utf8"),
  ) as Catalog;
  const errors = checkContent(
    root,
    catalog,
    process.argv.includes("--release"),
  );
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else console.log("Content check passed");
}
