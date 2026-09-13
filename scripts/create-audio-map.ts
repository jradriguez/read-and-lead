import { readFileSync, writeFileSync } from "node:fs";
import type { Catalog } from "../src/content/types";
import { renderAudioSources } from "./audio-sources";

const catalog = JSON.parse(
  readFileSync("content/catalog.json", "utf8"),
) as Catalog;
writeFileSync("src/audio/draft-sources.ts", renderAudioSources(catalog));
console.log(
  "Audio imports generated. Assets and human review still require validation.",
);
