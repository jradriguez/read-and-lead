import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
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
