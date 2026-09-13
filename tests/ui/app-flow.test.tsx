import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import App from "../../App";
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
