import { fireEvent, render, screen } from "@testing-library/react-native";
import { WorkshopScreen } from "../../src/features/workshop/WorkshopScreen";

test("an empty workshop has a clear start action and no earned-part or replay claims", async () => {
  const start = jest.fn();
  await render(<WorkshopScreen onStart={start} onParent={() => {}} />);
  expect(screen.getByText("0 of 2 robot parts collected")).toBeTruthy();
  expect(screen.getByLabelText("Robot part 1, not collected yet")).toBeTruthy();
  expect(screen.queryByText("Build again")).toBeNull();
  await fireEvent.press(screen.getByRole("button", { name: "Start lesson" }));
  expect(start).toHaveBeenCalledTimes(1);
});

test("collected parts, next mission and replay stay distinct and accessible", async () => {
  const replay = jest.fn();
  await render(
    <WorkshopScreen
      onStart={() => {}}
      onParent={() => {}}
      parts={1}
      nextLessonTitle="Build a robot seat"
      replays={[{ id: "first", title: "Wake up the workshop" }]}
      onReplay={replay}
    />,
  );
  expect(screen.getByText("Build a robot seat")).toBeTruthy();
  expect(screen.getByLabelText("Robot part 1, collected")).toBeTruthy();
  expect(screen.getByLabelText("Robot part 2, not collected yet")).toBeTruthy();
  await fireEvent.press(
    screen.getByRole("button", { name: "Replay Wake up the workshop" }),
  );
  expect(replay).toHaveBeenCalledWith("first");
});
