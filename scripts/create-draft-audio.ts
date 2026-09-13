// Optional macOS adult-development assets. Never marks content or rights approved.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import type { Catalog } from "../src/content/types";
const c = JSON.parse(readFileSync("content/catalog.json", "utf8")) as Catalog;
const prompts = JSON.parse(
  readFileSync("content/audio-scripts.json", "utf8"),
) as Record<string, string>;
mkdirSync("assets/draft", { recursive: true });
const sources: string[] = [];
for (const asset of c.assets) {
  if (!prompts[asset.id]) throw new Error(`No script: ${asset.id}`);
  const file = `assets/draft/${asset.id}.wav`;
  execFileSync("/usr/bin/say", [
    "-v",
    "Samantha",
    "-r",
    "145",
    "-o",
    file,
    "--file-format=WAVE",
    "--data-format=LEI16@22050",
    prompts[asset.id],
  ]);
  asset.file = `draft/${asset.id}.wav`;
  asset.sha256 = createHash("sha256").update(readFileSync(file)).digest("hex");
  asset.reviewed = false;
  sources.push(`${JSON.stringify(asset.id)}: require('../../${file}')`);
}
writeFileSync(
  "src/audio/draft-sources.ts",
  `// Generated local adult-demo audio; not approved for redistribution.\nexport const draftSources:Record<string,number>={${sources.join(",\n")}};\n`,
);
writeFileSync("content/catalog.json", JSON.stringify(c, null, 2) + "\n");
console.log(
  "Local draft clips created. Phonemes and redistribution rights are NOT approved.",
);
