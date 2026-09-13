// The same statements run in Expo SQLite and the real Node SQLite tests.
export const schema = [
  `CREATE TABLE IF NOT EXISTS attempts (id TEXT PRIMARY KEY, learner_id TEXT NOT NULL, session_id TEXT NOT NULL, lesson_id TEXT NOT NULL, lesson_version INTEGER NOT NULL, activity_id TEXT NOT NULL, outcome TEXT NOT NULL CHECK(outcome IN ('independent','assisted','incorrect','skipped')), hints INTEGER NOT NULL CHECK(hints >= 0), created_at INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS completions (learner_id TEXT NOT NULL, lesson_id TEXT NOT NULL, lesson_version INTEGER NOT NULL, PRIMARY KEY(learner_id,lesson_id,lesson_version))`,
  `CREATE TABLE IF NOT EXISTS totals (learner_id TEXT NOT NULL, outcome TEXT NOT NULL, count INTEGER NOT NULL, PRIMARY KEY(learner_id,outcome))`,
  `PRAGMA user_version = 1`,
];
