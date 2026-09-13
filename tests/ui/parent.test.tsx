import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react-native";
import { AppState, type AppStateStatus } from "react-native";
import { ParentScreen } from "../../src/features/parent/ParentScreen";
import { emptySummary } from "../../src/progress/repository";
async function setup(reset: () => Promise<void>) {
  return render(
    <ParentScreen
      repository={{
        async record() {},
        async summary() {
          return { ...emptySummary(), independent: 4 };
        },
        async prune() {},
        reset,
      }}
      onExit={() => {}}
      audioEnabled
      reducedMotion={false}
      onAudioChange={() => {}}
      onMotionChange={() => {}}
    />,
  );
}
test("cancelling reset preserves displayed progress", async () => {
  let resets = 0;
  await setup(async () => {
    resets++;
  });
  await waitFor(() => expect(screen.getByText("4")).toBeTruthy());
  await fireEvent.press(screen.getByRole("button", { name: "Reset progress" }));
  await fireEvent.press(screen.getByRole("button", { name: "Keep progress" }));
  expect(resets).toBe(0);
  expect(screen.getByText("4")).toBeTruthy();
});

test("successful confirmed reset clears counts", async () => {
  let resets = 0;
  await setup(async () => {
    resets++;
  });
  await fireEvent.press(screen.getByRole("button", { name: "Reset progress" }));
  await fireEvent.press(
    screen.getByRole("button", { name: "Delete local progress" }),
  );
  expect(resets).toBe(1);
  expect(screen.queryByText("4")).toBeNull();
  expect(screen.getByText("Progress reset.")).toBeTruthy();
});

test.each(["expired", "background"])(
  "%s parent session cannot confirm a recovery reset",
  async (mode) => {
    let now = 100;
    let background: (state: AppStateStatus) => void = () => {};
    const originalListener = AppState.addEventListener;
    AppState.addEventListener = jest.fn((_event, listener) => {
      background = listener;
      return { remove() {} };
    });
    const recover = jest.fn(async () => {});
    const exit = jest.fn();
    try {
      await render(
        <ParentScreen
          repository={null}
          storageError="Unavailable"
          onRecover={recover}
          onExit={exit}
          audioEnabled
          reducedMotion={false}
          onAudioChange={() => {}}
          onMotionChange={() => {}}
          now={() => now}
        />,
      );
      await fireEvent.press(
        screen.getByRole("button", { name: "Reset progress" }),
      );
      if (mode === "expired") now += 60000;
      else
        await act(async () => {
          background("background");
        });
      await fireEvent.press(
        screen.getByRole("button", { name: "Delete local progress" }),
      );
      expect(recover).not.toHaveBeenCalled();
      expect(exit).toHaveBeenCalled();
    } finally {
      AppState.addEventListener = originalListener;
    }
  },
);
test("failed reset is visible and cannot show successful deletion", async () => {
  await setup(async () => {
    throw new Error("disk");
  });
  await fireEvent.press(screen.getByRole("button", { name: "Reset progress" }));
  await fireEvent.press(
    screen.getByRole("button", { name: "Delete local progress" }),
  );
  await waitFor(() =>
    expect(
      screen.getByText("Progress could not be deleted. Please try again."),
    ).toBeTruthy(),
  );
  expect(screen.queryByText("Progress reset.")).toBeNull();
});
