import { act, render } from "@testing-library/react-native";
import { State } from "react-native-gesture-handler";
import {
  fireGestureHandler,
  getByGestureTestId,
} from "react-native-gesture-handler/jest-utils";
import { LetterTile } from "../../src/features/lesson/LetterTile";

test("a completed pan reports its release point once; cancellation never places a tile", async () => {
  const onDrop = jest.fn();
  const onSelect = jest.fn();
  await render(
    <LetterTile
      id="m"
      label="m"
      selected={false}
      onDrop={onDrop}
      onSelect={onSelect}
    />,
  );
  await act(() =>
    fireGestureHandler(getByGestureTestId("drag-m"), [
      { state: State.BEGAN },
      { state: State.ACTIVE, translationX: 40, translationY: -50 },
      { state: State.END, absoluteX: 120, absoluteY: 230 },
    ]),
  );
  expect(onDrop).toHaveBeenCalledTimes(1);
  expect(onDrop).toHaveBeenCalledWith(120, 230);
  expect(onSelect).not.toHaveBeenCalled();
  onDrop.mockClear();
  await act(() =>
    fireGestureHandler(getByGestureTestId("drag-m"), [
      { state: State.BEGAN },
      { state: State.ACTIVE, translationX: 50 },
      { state: State.CANCELLED, absoluteX: 120, absoluteY: 230 },
    ]),
  );
  expect(onDrop).not.toHaveBeenCalled();
});
