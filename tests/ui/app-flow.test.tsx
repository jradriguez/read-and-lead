import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import App from "../../App";
import { catalog } from "../../src/content/catalog";
import {
  emptySummary,
  type ProgressRepository,
} from "../../src/progress/repository";
test("workshop opens a lesson after loading local dependencies", async () => {
  const repository: ProgressRepository = {
    async record() {},
    async summary() {
      return emptySummary();
    },
    async reset() {},
    async prune() {},
  };
  await render(
    <App
      load={async () => ({ repository, audio: { async play() {}, stop() {} } })}
    />,
  );
  await fireEvent.press(screen.getByTestId("start-lesson"));
  await waitFor(() => expect(screen.getByTestId("lesson-screen")).toBeTruthy());
  expect(screen.getByText("Meet the sounds")).toBeTruthy();
});

async function openParents() {
  await fireEvent.press(screen.getByRole("button", { name: "Parent area" }));
  const prompt = screen.getByText(/For grown-ups: what is/).props
    .children as string;
  const numbers = prompt.match(/\d+/g)!.map(Number);
  await fireEvent.changeText(
    screen.getByLabelText("Grown-up answer"),
    String(numbers[0] * numbers[1]),
  );
  await fireEvent.press(
    screen.getByRole("button", { name: "Open parent area" }),
  );
}

test("failed database initialization leaves confirmed parent recovery accessible", async () => {
  const recover = jest.fn(async () => {});
  await render(
    <App
      load={async () => {
        throw new Error("NEWER_SCHEMA");
      }}
      recover={recover}
    />,
  );
  await openParents();
  expect(screen.getByText(/newer app version/)).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Reset progress" }));
  await fireEvent.press(screen.getByRole("button", { name: "Keep progress" }));
  expect(recover).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole("button", { name: "Reset progress" }));
  await fireEvent.press(
    screen.getByRole("button", { name: "Delete local progress" }),
  );
  expect(recover).toHaveBeenCalledTimes(1);
  expect(screen.queryByText("Progress reset.")).toBeNull();
});

test("both completed lessons remain available for replay without deleting parts", async () => {
  const repository: ProgressRepository = {
    async record() {},
    async reset() {},
    async prune() {},
    async summary() {
      return {
        ...emptySummary(),
        completedLessonIds: catalog.lessons.map((l) => l.id),
      };
    },
  };
  await render(
    <App
      load={async () => ({ repository, audio: { async play() {}, stop() {} } })}
    />,
  );
  await fireEvent.press(
    screen.getByRole("button", { name: `Replay ${catalog.lessons[1].title}` }),
  );
  expect(screen.getByTestId("tile-t")).toBeTruthy();
  expect(screen.queryByTestId("tile-m")).toBeNull();
  await fireEvent.press(screen.getByRole("button", { name: "Workshop" }));
  expect(screen.getByText("2 of 2 robot parts collected")).toBeTruthy();
});

test("confirmed recovery reopens progress and permits a lesson", async () => {
  let recovered = false;
  const repository: ProgressRepository = {
    async record() {},
    async reset() {},
    async prune() {},
    async summary() {
      return emptySummary();
    },
  };
  await render(
    <App
      load={async () => {
        if (!recovered) throw new Error("corrupt");
        return { repository, audio: { async play() {}, stop() {} } };
      }}
      recover={async () => {
        recovered = true;
      }}
    />,
  );
  await openParents();
  await fireEvent.press(screen.getByRole("button", { name: "Reset progress" }));
  await fireEvent.press(
    screen.getByRole("button", { name: "Delete local progress" }),
  );
  expect(screen.getByText("Progress reset.")).toBeTruthy();
  await fireEvent.press(
    screen.getByRole("button", { name: "Back to workshop" }),
  );
  await fireEvent.press(screen.getByTestId("start-lesson"));
  expect(screen.getByTestId("lesson-screen")).toBeTruthy();
});
