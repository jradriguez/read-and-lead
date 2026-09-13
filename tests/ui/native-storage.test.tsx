import { deleteDatabaseAsync, openDatabaseAsync } from "expo-sqlite";
import {
  openNativeProgress,
  resetUnavailableNativeProgress,
} from "../../src/progress/native";

jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(),
  deleteDatabaseAsync: jest.fn(),
}));

test("newer schema closes its handle and preserves the database until explicit recovery", async () => {
  const closeAsync = jest.fn(async () => {});
  jest.mocked(openDatabaseAsync).mockResolvedValue({
    getAllAsync: async () => [{ user_version: 2 }],
    closeAsync,
  } as unknown as Awaited<ReturnType<typeof openDatabaseAsync>>);
  await expect(openNativeProgress()).rejects.toThrow("NEWER_SCHEMA");
  expect(closeAsync).toHaveBeenCalledTimes(1);
  expect(deleteDatabaseAsync).not.toHaveBeenCalled();
  await resetUnavailableNativeProgress();
  expect(deleteDatabaseAsync).toHaveBeenCalledWith("progress.sqlite");
});

test("a failed close prevents database deletion", async () => {
  const closeAsync = jest.fn(async (): Promise<void> => {
    throw new Error("busy handle");
  });
  jest.mocked(openDatabaseAsync).mockResolvedValue({
    getAllAsync: async () => {
      throw new Error("corrupt");
    },
    closeAsync,
  } as unknown as Awaited<ReturnType<typeof openDatabaseAsync>>);
  await expect(openNativeProgress()).rejects.toThrow("busy handle");
  await expect(resetUnavailableNativeProgress()).rejects.toThrow("busy handle");
  expect(deleteDatabaseAsync).not.toHaveBeenCalled();
  closeAsync.mockResolvedValue(undefined);
  await resetUnavailableNativeProgress();
});
