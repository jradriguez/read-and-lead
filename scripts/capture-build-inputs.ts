import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { checkContent } from "./check-content";
import type { Catalog } from "../src/content/types";

// An input inventory, not a release gate or a claim about a compiled artifact.
// Keep data, credentials, native caches and environment values out of evidence.
export function hashInputs(root: string, files: string[]) {
  return [...new Set(files)].sort().map((file) => {
    const parts = file.split("/");
    if (parts.some((p) => !p || p === "." || p === "..") || file.includes("\\"))
      throw new Error(`INPUT_PATH:${file}`);
    if (
      parts.some((_, i) =>
        lstatSync(resolve(root, ...parts.slice(0, i + 1))).isSymbolicLink(),
      )
    )
      throw new Error(`INPUT_SYMLINK:${file}`);
    const bytes = readFileSync(resolve(root, file));
    return {
      file,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    };
  });
}

if (process.argv[1]?.endsWith("capture-build-inputs.ts")) {
  const root = process.cwd();
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  const catalog = JSON.parse(
    readFileSync(join(root, "content/catalog.json"), "utf8"),
  ) as Catalog;
  const errors = checkContent(root, catalog, false);
  if (errors.length)
    throw new Error(`INPUT_CONTENT_INVALID:\n${errors.join("\n")}`);
  const files = git(
    "ls-files",
    "--cached",
    "--others",
    "--exclude-standard",
    "-z",
  )
    .split("\0")
    .filter((file) =>
      /^(App\.tsx|index\.ts|app\.json|package(-lock)?\.json|tsconfig\.json|(?:babel|metro)\.config\.[cm]?js|(?:src|plugins|content|assets)\/.*)$/.test(
        file,
      ),
    );
  const inputs = hashInputs(root, [
    ...files,
    "src/audio/draft-sources.ts",
    ...catalog.assets.map((asset) => `assets/${asset.file}`),
  ]);
  // npm reads the committed-resolution format, including build dependencies;
  // no install, audit upload, third-party scanner or native resolution is run.
  const sbom = execFileSync(
    "npm",
    [
      "sbom",
      "--package-lock-only",
      "--sbom-format",
      "cyclonedx",
      "--sbom-type",
      "application",
    ],
    { cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
  );
  JSON.parse(sbom);
  mkdirSync(join(root, "outputs"), { recursive: true });
  const output = mkdtempSync(join(root, "outputs/build-inputs-"));
  writeFileSync(join(output, "npm-sbom.cdx.json"), sbom);
  writeFileSync(
    join(output, "inputs.json"),
    JSON.stringify(
      {
        kind: "read-and-lead-build-inputs/1",
        createdAt: new Date().toISOString(),
        sourceRevision: git("rev-parse", "HEAD"),
        workingTreeDirty: !!git("status", "--porcelain"),
        node: process.version,
        npm: execFileSync("npm", ["--version"], { encoding: "utf8" }).trim(),
        inputs,
        npmSbomSha256: createHash("sha256").update(sbom).digest("hex"),
        contentReleaseErrors: checkContent(root, catalog, true),
        limitations: [
          "Input snapshot only: no compiled or signed artifact is certified.",
          "npm lockfile inventory is not a native Pod/Gradle or packaged-binary SBOM.",
          "Native resolutions, toolchain, privacy manifests, permissions, binary hash and device evidence must be attached after a build.",
          "Legal, content, rights and owner approvals require human evidence.",
        ],
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `Input evidence captured: ${output}\nRelease approval is not implied.`,
  );
}
