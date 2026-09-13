import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Filename checks remain effective when an ignored file is force-added.
export function isPrivatePath(file: string): boolean {
  return (
    /(^|\/)(outputs|recordings|private|learner-data|secrets|credentials|tokens|auth|keys|vault|contracts|invoices|quotes|auditions|raw-audio|exports|artifacts|backups|browser-profiles|cookies|sessions|logs|tmp|temp|\.auth|\.aws|\.azure|\.gnupg|\.kube|\.ssh|\.password-store|\.codex|\.claude|\.gemini|\.superpowers)\//i.test(
      file,
    ) ||
    /(^|\/)(\.config\/gcloud\/|\.docker\/config\.json$)/i.test(file) ||
    /^assets\/draft\/|^src\/audio\/draft-sources\.ts$|^docs\/agent-workflows\/(handoffs|grill-sessions)\/|^owner-review.*\.md$/i.test(
      file,
    ) ||
    (/(^|\/)\.env($|\.)/i.test(file) &&
      file.split("/").at(-1) !== ".env.example") ||
    /(^|\/)(\.envrc$|\.npmrc$|\.pypirc$|config\.local\.|settings\.local\.json$|credentials\.json$|service-account.*\.json$|google-services\.json$|GoogleService-Info\.plist$)/i.test(
      file,
    ) ||
    /storage[-_]?state.*\.json$/i.test(file) ||
    /\.(sqlite.*|db.*|p8|p12|pem|key|mobileprovision|keystore|jks|crt|cer|der|csr|pfx|ppk|secret|secrets\.json|keychain.*|cookie|dump|backup|bak|age|asc|enc|gpg|ipa|apk|aab|log|zip|tar|gz|7z|pcap.*|har)$/i.test(
      file,
    ) ||
    /\.(xcarchive|xcresult)(\/|$)/i.test(file)
  );
}

export function privateTextFindings(text: string): string[] {
  const findings: string[] = [];
  // High-signal checks only. These do not classify all personal data or IP.
  if (
    /(?:\/Users\/|\/home\/|[A-Z]:\\Users\\)[\p{L}\p{N}_.-][^/\\\r\n"'`<>|]*/iu.test(
      text,
    )
  )
    findings.push("PERSONAL_HOME_PATH");
  if (
    /[\w.%+-]+@(?:gmail|googlemail|outlook|hotmail|live|yahoo|icloud|me|aol|protonmail)\.com\b|[\w.%+-]+@proton\.me\b/i.test(
      text,
    )
  )
    findings.push("PERSONAL_EMAIL");
  return findings;
}

export function checkPublicationIdentity(root: string): string[] {
  const errors: string[] = [];
  for (const identity of ["GIT_AUTHOR_IDENT", "GIT_COMMITTER_IDENT"]) {
    try {
      const value = execFileSync("git", ["-C", root, "var", identity], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      if (!/<[^<>\s]+@users\.noreply\.github\.com>/.test(value))
        errors.push(
          `PUBLICATION_EMAIL:${identity}:use your verified GitHub noreply address`,
        );
    } catch {
      errors.push(`MISSING_IDENTITY:${identity}`);
    }
  }
  return errors;
}

export function checkRepo(root: string): string[] {
  const files = execFileSync("git", ["-C", root, "ls-files", "-z"], {
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean);
  const errors = files.filter(isPrivatePath).map((f) => `PRIVATE_PATH:${f}`);
  for (const file of files.filter((f) => !isPrivatePath(f))) {
    // Read the index, not the working copy: unstaged redaction must not hide
    // private bytes already staged for publication. Do not follow symlinks.
    try {
      const bytes = execFileSync("git", ["-C", root, "show", `:${file}`], {
        maxBuffer: 16 * 1024 * 1024,
        stdio: ["ignore", "pipe", "pipe"],
      });
      if (!bytes.includes(0))
        errors.push(
          ...privateTextFindings(bytes.toString("utf8")).map(
            (kind) => `${kind}:${file}`,
          ),
        );
    } catch {
      errors.push(`UNREADABLE_INDEX:${file}`);
    }
  }
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
  if (process.argv.includes("--publication"))
    errors.push(...checkPublicationIdentity(process.cwd()));
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else console.log("Repository boundary check passed");
}
