import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  openProgressRepository,
  type Sql,
} from "../src/progress/repository.ts";
import type { Attempt } from "../src/learning/types";
function adapter(db = new DatabaseSync(":memory:")): Sql {
  const sql: Sql = {
    async run(q, p = []) {
      db.prepare(q).run(...p);
    },
    async all<T>(q: string, p: (string | number)[] = []) {
      return db.prepare(q).all(...p) as T[];
    },
    async transaction<T>(fn: (db: Sql) => Promise<T>) {
      db.exec("BEGIN");
      try {
        const out = await fn(sql);
        db.exec("COMMIT");
        return out;
      } catch (e) {
        db.exec("ROLLBACK");
        throw e;
      }
    },
  };
  return sql;
}
const sample: Attempt = {
  id: "a",
  learnerId: "local",
  sessionId: "s",
  lessonId: "first",
  lessonVersion: 1,
  activityId: "one",
  outcome: "independent",
  hints: 0,
  createdAt: 100,
};
test("replayed saves cannot inflate attempts or earned parts", async () => {
  const repo = await openProgressRepository(adapter());
  await repo.record(sample, { id: "first", version: 1 });
  await repo.record(sample, { id: "first", version: 1 });
  assert.deepEqual(await repo.summary("local"), {
    independent: 1,
    assisted: 0,
    incorrect: 0,
    skipped: 0,
    completedLessonIds: ["first"],
  });
});
test("failed completion transaction does not leave a saved attempt", async () => {
  const sql = adapter();
  const repo = await openProgressRepository(sql);
  await sql.run(
    "CREATE TRIGGER fail BEFORE INSERT ON completions BEGIN SELECT RAISE(ABORT,'injected disk failure'); END",
  );
  await assert.rejects(
    repo.record(sample, { id: "first", version: 1 }),
    /injected disk failure/,
  );
  assert.equal((await repo.summary("local")).independent, 0);
});
test("retention keeps independent and assisted totals and exact boundary without double counting", async () => {
  const sql = adapter();
  const repo = await openProgressRepository(sql);
  await repo.record(sample);
  await repo.record({
    ...sample,
    id: "b",
    createdAt: 200,
    outcome: "assisted",
    hints: 1,
  });
  await repo.prune(200);
  await repo.prune(200);
  assert.equal((await sql.all("SELECT * FROM attempts")).length, 1);
  const s = await repo.summary("local");
  assert.equal(s.independent, 1);
  assert.equal(s.assisted, 1);
  await repo.reset("local");
  assert.equal((await repo.summary("local")).independent, 0);
  assert.equal((await repo.summary("local")).assisted, 0);
});
test("reset clears completions but leaves another local slot untouched", async () => {
  const repo = await openProgressRepository(adapter());
  await repo.record(sample, { id: "first", version: 1 });
  await repo.record({ ...sample, id: "b", learnerId: "another" });
  await repo.reset("local");
  assert.deepEqual((await repo.summary("local")).completedLessonIds, []);
  assert.equal((await repo.summary("another")).independent, 1);
});
test("newer database schema is rejected without changing its version", async () => {
  const sql = adapter();
  await sql.run("PRAGMA user_version=9");
  await assert.rejects(openProgressRepository(sql), /NEWER_SCHEMA/);
  assert.equal(
    (await sql.all<{ user_version: number }>("PRAGMA user_version"))[0]
      .user_version,
    9,
  );
});
test("concurrent duplicate saves serialize safely", async () => {
  const repo = await openProgressRepository(adapter());
  await Promise.all([repo.record(sample), repo.record(sample)]);
  assert.equal((await repo.summary("local")).independent, 1);
});
test("invalid attempt constraints cannot silently award a part", async () => {
  const repo = await openProgressRepository(adapter());
  await assert.rejects(
    repo.record({ ...sample, hints: -1 }, { id: "first", version: 1 }),
  );
  assert.deepEqual((await repo.summary("local")).completedLessonIds, []);
});

for (const separateConnection of [false, true]) {
  for (const action of ["reset", "prune"] as const) {
    test(`${action} scrubs SQLite pages with ${separateConnection ? "separate" : "shared"} transaction connections`, async () => {
      const root = mkdtempSync(join(tmpdir(), "read-lead-delete-"));
      const path = join(root, "progress.sqlite");
      const db = new DatabaseSync(path);
      try {
        db.exec("PRAGMA secure_delete=OFF; PRAGMA journal_mode=DELETE");
        const sql = adapter(db);
        if (separateConnection)
          sql.transaction = async (fn) => {
            // Expo exclusive transactions open a fresh connection, so PRAGMAs
            // on the reader connection do not protect writes automatically.
            const tx = new DatabaseSync(path);
            try {
              tx.exec("PRAGMA secure_delete=OFF");
              return await adapter(tx).transaction(fn);
            } finally {
              tx.close();
            }
          };
        const repo = await openProgressRepository(sql);
        const marker = "SYNTHETIC-PRIVATE-DETAIL-".repeat(20);
        await repo.record({ ...sample, activityId: marker });
        assert.ok(readFileSync(path).includes(Buffer.from(marker)));
        if (action === "reset") await repo.reset("local");
        else await repo.prune(200);
        assert.equal(readFileSync(path).includes(Buffer.from(marker)), false);
      } finally {
        db.close();
        rmSync(root, { recursive: true, force: true });
      }
    });
  }
}

test("unavailable secure deletion fails before schema creation", async () => {
  const sql = adapter();
  const all = sql.all.bind(sql);
  sql.all = async <T>(q: string, p?: (string | number)[]) =>
    q === "PRAGMA secure_delete"
      ? ([{ secure_delete: 0 }] as T[])
      : all<T>(q, p);
  await assert.rejects(
    openProgressRepository(sql),
    /SECURE_DELETE_UNAVAILABLE/,
  );
  assert.equal(
    (await all<{ user_version: number }>("PRAGMA user_version"))[0]
      .user_version,
    0,
  );
});
