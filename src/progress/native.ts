import {
  deleteDatabaseAsync,
  openDatabaseAsync,
  type SQLiteDatabase,
} from "expo-sqlite";
import { openProgressRepository, type Sql } from "./repository";
function adapt(
  db: Pick<SQLiteDatabase, "runAsync" | "getAllAsync">,
  transaction: Sql["transaction"],
): Sql {
  return {
    async run(q, p = []) {
      await db.runAsync(q, p);
    },
    all<T>(q: string, p: (string | number)[] = []) {
      return db.getAllAsync<T>(q, p);
    },
    transaction,
  };
}
let currentDatabase: SQLiteDatabase | null = null;
async function closeCurrentDatabase() {
  if (currentDatabase) {
    await currentDatabase.closeAsync();
    currentDatabase = null;
  }
}
// Called only after the parent gate and a separate destructive-reset confirmation.
export async function resetUnavailableNativeProgress() {
  await closeCurrentDatabase();
  await deleteDatabaseAsync("progress.sqlite");
}
export async function openNativeProgress() {
  await closeCurrentDatabase();
  const db = await openDatabaseAsync("progress.sqlite");
  currentDatabase = db;
  const adapter = adapt(db, async (fn) => {
    let result: unknown;
    await db.withExclusiveTransactionAsync(async (tx) => {
      result = await fn(
        adapt(tx, async () => {
          throw new Error("Nested transactions unsupported");
        }),
      );
    });
    return result as never;
  });
  try {
    const repo = await openProgressRepository(adapter);
    await repo.prune(Date.now() - 90 * 24 * 60 * 60 * 1000);
    return repo;
  } catch (error) {
    await closeCurrentDatabase();
    throw error;
  }
}
