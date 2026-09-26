import {
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { LessonScreen } from "../../src/features/lesson/LessonScreen";
import { makeCatalog } from "../fixtures/catalog";
import {
  emptySummary,
  type ProgressRepository,
} from "../../src/progress/repository";
import type { Attempt } from "../../src/learning/types";
const lesson = {
  ...makeCatalog().lessons[0],
  introducedPatternIds: [],
  activities: [makeCatalog().lessons[0].activities[1]],
};
function setup(record: ProgressRepository["record"]) {
  return render(
    <LessonScreen
      lesson={lesson}
      catalog={makeCatalog()}
      repository={{
        record,
        async summary() {
          return emptySummary();
        },
        async reset() {},
        async prune() {},
      }}
      audio={{ async play() {}, stop() {} }}
      onComplete={() => {}}
      onExit={() => {}}
      reducedMotion
      random={() => 0.5}
    />,
  );
}
test("hinted tap placement saves an assisted response", async () => {
  const attempts: Attempt[] = [];
  await setup(async (a) => {
    attempts.push(a);
  });
  await fireEvent.press(screen.getByRole("button", { name: "Show me" }));
  await fireEvent.press(screen.getByTestId("tile-short-a"));
  await fireEvent.press(screen.getByTestId("slot-0"));
  await fireEvent.press(screen.getByTestId("tile-m"));
  await fireEvent.press(screen.getByTestId("slot-1"));
  await fireEvent.press(screen.getByTestId("check-answer"));
  await waitFor(() => expect(screen.getByText("You built it!")).toBeTruthy());
  expect(attempts).toHaveLength(1);
  expect(attempts[0].outcome).toBe("assisted");
});

test("separate lessons get distinct UUID sessions even with a fixed clock and shuffle", async () => {
  const attempts: Attempt[] = [];
  const clock = jest.spyOn(Date, "now").mockReturnValue(1000);
  try {
    const first = await setup(async (a) => {
      attempts.push(a);
    });
    await fireEvent.press(screen.getByRole("button", { name: "Skip for now" }));
    await first.unmount();
    await setup(async (a) => {
      attempts.push(a);
    });
    await fireEvent.press(screen.getByRole("button", { name: "Skip for now" }));
    expect(attempts).toHaveLength(2);
    expect(attempts[0].sessionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(attempts[0].sessionId).not.toBe(attempts[1].sessionId);
    expect(attempts[0].id).not.toBe(attempts[1].id);
  } finally {
    clock.mockRestore();
  }
});
test("failed save keeps activity available and retry reuses the same event ID", async () => {
  const attempts: Attempt[] = [];
  await setup(async (a) => {
    attempts.push(a);
    if (attempts.length === 1) throw new Error("disk");
  });
  await fireEvent.press(screen.getByTestId("tile-short-a"));
  await fireEvent.press(screen.getByTestId("slot-0"));
  await fireEvent.press(screen.getByTestId("tile-m"));
  await fireEvent.press(screen.getByTestId("slot-1"));
  await fireEvent.press(screen.getByTestId("check-answer"));
  expect(
    screen.getByText("Progress could not be saved. Tap retry."),
  ).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Retry save" }));
  await waitFor(() => expect(screen.getByText("You built it!")).toBeTruthy());
  expect(attempts[0].id).toBe(attempts[1].id);
});
test("rapid submit taps cannot duplicate a completion", async () => {
  let release!: () => void;
  let saves = 0;
  await setup(async () => {
    saves++;
    await new Promise<void>((r) => {
      release = r;
    });
  });
  await fireEvent.press(screen.getByTestId("tile-short-a"));
  await fireEvent.press(screen.getByTestId("slot-0"));
  await fireEvent.press(screen.getByTestId("tile-m"));
  await fireEvent.press(screen.getByTestId("slot-1"));
  await fireEvent.press(screen.getByTestId("check-answer"));
  await fireEvent.press(screen.getByTestId("check-answer"));
  expect(saves).toBe(1);
  release();
  await waitFor(() => expect(screen.getByText("You built it!")).toBeTruthy());
});
test("advancing to the next activity plays its prompt rather than the previous sound", async () => {
  const played: string[] = [];
  const c = makeCatalog();
  const two = { ...c.lessons[0], introducedPatternIds: [] };
  await render(
    <LessonScreen
      lesson={two}
      catalog={c}
      repository={{
        async record() {},
        async summary() {
          return emptySummary();
        },
        async reset() {},
        async prune() {},
      }}
      audio={{
        async play(id) {
          played.push(id);
        },
        stop() {},
      }}
      onComplete={() => {}}
      onExit={() => {}}
      reducedMotion
    />,
  );
  await fireEvent.press(screen.getByTestId("tile-m"));
  await fireEvent.press(screen.getByTestId("check-answer"));
  await waitFor(() => expect(played).toContain("am"));
});
test("empty word slots cannot be recorded as a reading error", async () => {
  let saves = 0;
  await setup(async () => {
    saves++;
  });
  const check = screen.getByRole("button", { name: "Check answer" });
  expect(check.props.accessibilityState.disabled).toBe(true);
  expect(screen.getByRole("progressbar").props.accessibilityValue.now).toBe(0);
  await fireEvent.press(check);
  expect(saves).toBe(0);
  await fireEvent.press(screen.getByTestId("tile-short-a"));
  await fireEvent.press(screen.getByTestId("slot-0"));
  expect(
    screen.getByRole("button", { name: "Check answer" }).props
      .accessibilityState.disabled,
  ).toBe(true);
  await fireEvent.press(screen.getByTestId("tile-m"));
  await fireEvent.press(screen.getByTestId("slot-1"));
  expect(
    screen.getByRole("button", { name: "Check answer" }).props
      .accessibilityState.disabled,
  ).toBe(false);
  await fireEvent.press(screen.getByTestId("check-answer"));
  await waitFor(() =>
    expect(screen.getByRole("progressbar").props.accessibilityValue.now).toBe(
      1,
    ),
  );
  expect(saves).toBe(1);
});
