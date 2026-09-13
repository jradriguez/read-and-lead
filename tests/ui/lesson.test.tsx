import { render, screen } from "@testing-library/react-native";
import App from "../../App";
test("a non-reader can find the lesson entry action", async () => {
  await render(<App />);
  expect(screen.getByTestId("workshop")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Start lesson" })).toBeTruthy();
});
