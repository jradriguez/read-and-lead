import { schema } from "./schema";
import type { Attempt, Outcome } from "../learning/types";
export type Sql = {
  run(sql: string, params?: (string | number)[]): Promise<void>;
  all<T>(sql: string, params?: (string | number)[]): Promise<T[]>;
  transaction<T>(fn: (db: Sql) => Promise<T>): Promise<T>;
};
export type ProgressSummary = Record<Outcome, number> & {
  completedLessonIds: string[];
};
export type ProgressRepository = {
  record(
    attempt: Attempt,
    completedLesson?: { id: string; version: number },
  ): Promise<void>;
  summary(learnerId: string): Promise<ProgressSummary>;
  reset(learnerId: string): Promise<void>;
  prune(before: number): Promise<void>;
};
export const emptySummary = (): ProgressSummary => ({
  independent: 0,
  assisted: 0,
  incorrect: 0,
  skipped: 0,
  completedLessonIds: [],
});
export async function openProgressRepository(
  db: Sql,
): Promise<ProgressRepository> {
  const version = (
    await db.all<{ user_version: number }>("PRAGMA user_version")
  )[0].user_version;
  if (version > 1) throw new Error("NEWER_SCHEMA");
  if (version === 0)
    await db.transaction(async (tx) => {
      for (const statement of schema) await tx.run(statement);
    });
  // A single connection must never interleave BEGIN/COMMIT from separate callers.
  let tail: Promise<unknown> = Promise.resolve();
  function serial<T>(job: () => Promise<T>): Promise<T> {
    const next = tail.then(job);
    tail = next.catch(() => {});
    return next;
  }
  return {
    record(a, completion) {
      return serial(() =>
        db.transaction(async (tx) => {
          if (
            completion &&
            (completion.id !== a.lessonId ||
              completion.version !== a.lessonVersion ||
              a.outcome === "incorrect")
          )
            throw new Error("INVALID_COMPLETION");
          await tx.run(
            "INSERT INTO attempts VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING",
            [
              a.id,
              a.learnerId,
              a.sessionId,
              a.lessonId,
              a.lessonVersion,
              a.activityId,
              a.outcome,
              a.hints,
              a.createdAt,
            ],
          );
          if (completion)
            await tx.run("INSERT OR IGNORE INTO completions VALUES (?,?,?)", [
              a.learnerId,
              completion.id,
              completion.version,
            ]);
        }),
      );
    },
    summary(learner) {
      return serial(async () => {
        const out = emptySummary();
        const rows = await db.all<{ outcome: Outcome; count: number }>(
          "SELECT outcome,COUNT(*) AS count FROM attempts WHERE learner_id=? GROUP BY outcome UNION ALL SELECT outcome,count FROM totals WHERE learner_id=?",
          [learner, learner],
        );
        rows.forEach((r) => {
          out[r.outcome] += r.count;
        });
        out.completedLessonIds = (
          await db.all<{ lesson_id: string }>(
            "SELECT DISTINCT lesson_id FROM completions WHERE learner_id=? ORDER BY lesson_id",
            [learner],
          )
        ).map((r) => r.lesson_id);
        return out;
      });
    },
    reset(learner) {
      return serial(() =>
        db.transaction(async (tx) => {
          for (const table of ["attempts", "totals", "completions"])
            await tx.run(`DELETE FROM ${table} WHERE learner_id=?`, [learner]);
        }),
      );
    },
    prune(before) {
      return serial(() =>
        db.transaction(async (tx) => {
          await tx.run(
            "INSERT INTO totals SELECT learner_id,outcome,COUNT(*) FROM attempts WHERE created_at < ? GROUP BY learner_id,outcome ON CONFLICT(learner_id,outcome) DO UPDATE SET count=totals.count+excluded.count",
            [before],
          );
          await tx.run("DELETE FROM attempts WHERE created_at < ?", [before]);
        }),
      );
    },
  };
}
