import type { Catalog } from "../src/content/types";

// One canonical source for generation and the release gate. No audio is evaluated.
export function renderAudioSources(catalog: Catalog): string {
  const entries = catalog.assets.map(
    (asset) =>
      `  ${JSON.stringify(asset.id)}: require(${JSON.stringify(`../../assets/${asset.file}`)}),`,
  );
  return `// Generated from the catalog. This does not approve teaching content or rights.\nexport const draftSources: Record<string, number> = {\n${entries.join("\n")}\n};\n`;
}
