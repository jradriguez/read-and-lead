import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
export function checkRepo(root: string): string[] {
  const files = execFileSync("git", ["-C", root, "ls-files", "-z"], {
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean);
  const errors = files
    .filter(
      (f) =>
        /(^|\/)(outputs|recordings|private|\.auth|learner-data)\/|(^|\/)\.env($|\.)|\.(sqlite.*|db.*|p12|mobileprovision|keystore|jks)$/.test(
          f,
        ) && !f.endsWith(".env.example"),
    )
    .map((f) => `PRIVATE_PATH:${f}`);
  try {
    const p = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
    for (const name of [
      "lint",
      "typecheck",
      "test:unit",
      "test:ui",
      "content:check",
      "repo:check",
      "validate",
      "security:check",
    ])
      if (!p.scripts?.[name]) errors.push(`MISSING_COMMAND:${name}`);
  } catch {
    errors.push("MISSING_PACKAGE");
  }
  return errors;
}
if (process.argv[1]?.endsWith("check-repo.ts")) {
  const errors = checkRepo(process.cwd());
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else console.log("Repository boundary check passed");
}
